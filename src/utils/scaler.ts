import * as sm from '@shumai/shumai';

interface BaseScaler {
	fit: (x: sm.Tensor) => void;
	partialFit: (x: sm.Tensor) => void;
	transform: (x: sm.Tensor) => sm.Tensor;
	fitTransform: (x: sm.Tensor) => sm.Tensor;
	inverseTransform: (x: sm.Tensor) => sm.Tensor;
}

export class StandardScaler implements BaseScaler {
	public withMean = true;
	public withStd = true;
	private nSamplesSeen = 0;
	public mean: sm.Tensor;
	public var: sm.Tensor;
	public scale: sm.Tensor;

	constructor(opts: { withMean?: boolean; withStd?: boolean } = {}) {
		const { withMean, withStd } = opts;
		this.withMean = withMean || true;
		this.withStd = withStd || true;
	}

	// reset - resets internal state
	private reset() {
		this.nSamplesSeen = 0;
	}

	// fit - computes the mean and std
	public fit(x: sm.Tensor) {
		this.reset();
		let usedX = x;
		if (x.shape.length === 1) {
			usedX = x.deepCopy().reshape([x.shape[0], 1]);
		}
		return this.partialFit(usedX);
	}

	// partialFit - computes the mean and std
	public partialFit(x: sm.Tensor) {
		const [nSamples, nFeatures] = x.shape,
			dtype = x.dtype;
		if (nSamples == 0) throw new Error('cannot calc fit for StandardScaler with `x.shape[0] == 0`');
		if (this.nSamplesSeen == 0) {
			this.var = sm.tensor(new Float64Array(nFeatures).fill(0)).astype(dtype);
			this.mean = sm.tensor(new Float64Array(nFeatures).fill(0)).astype(dtype);
			this.scale = sm.tensor(new Float64Array(nFeatures).fill(0)).astype(dtype);
		}

		const { updatedMean, updatedVariance, updatedSampleCount } = incrementalMeanVar(
			x,
			this.mean,
			this.var,
			this.nSamplesSeen
		);
		this.mean = updatedMean;
		this.var = updatedVariance;
		this.nSamplesSeen = updatedSampleCount;
		const tmp_scale = this.var.valueOf(),
			len = tmp_scale.length;
		for (let i = 0; i < len; i++) {
			if (tmp_scale[i] == 0) {
				tmp_scale[i] = 1;
			}
			tmp_scale[i] = Math.sqrt(tmp_scale[i]);
		}
		this.scale = sm.tensor(tmp_scale).astype(dtype);
	}

	// transform - scales the data
	public transform(x: sm.Tensor) {
		const dtype = x.dtype;
		let isShapeCoerced = false,
			usedX = x;
		if (x.shape.length === 1) {
			isShapeCoerced = true;
			usedX = x.deepCopy().reshape([x.shape[0], 1]);
		}
		const [xRows, xCols] = usedX.shape,
			xOut = sm.tensor(new Float64Array(usedX.elements).fill(0)).astype(dtype).valueOf();
		const tmp_contig = usedX.valueOf();
		const tmp_mean = this.mean.copy().valueOf(),
			tmp_scale = this.scale.valueOf();
		for (let i = 0; i < xCols; i++) {
			let mean = 0,
				scale = 1;
			if (this.withMean) {
				mean = tmp_mean[i];
			}
			if (this.withStd) {
				scale = tmp_scale[i];
			}
			for (let jX = 0, jXout = 0; jX < xRows * xCols; jX = jX + xCols, jXout = jXout + xCols) {
				xOut[jXout + i] = (tmp_contig[jX + i] - mean) / scale;
			}
		}
		const outShape = isShapeCoerced ? [xRows] : [xRows, xCols];
		return sm.tensor(xOut).reshape(outShape);
	}

	// fitTransform - fit to data, then transform it
	public fitTransform(x: sm.Tensor) {
		this.fit(x);
		return this.transform(x);
	}

	// inverseTransform - undo the scaling of the data
	public inverseTransform(x: sm.Tensor) {
		const dtype = x.dtype;
		let isShapeCoerced = false,
			usedX = x;
		if (x.shape.length === 1) {
			isShapeCoerced = true;
			usedX = x.deepCopy().reshape([x.shape[0], 1]);
		}
		const [xRows, xCols] = usedX.shape,
			xOut = sm.tensor(new Float64Array(usedX.elements).fill(0)).astype(dtype).valueOf();
		const tmp_contig = usedX.valueOf();
		const tmp_mean = this.mean.valueOf(),
			tmp_scale = this.scale.valueOf();
		for (let i = 0; i < xCols; i++) {
			let mean = 0,
				scale = 1;
			if (this.withMean) {
				mean = tmp_mean[i];
			}
			if (this.withStd) {
				scale = tmp_scale[i];
			}
			for (let jX = 0, jXout = 0; jX < xRows * xCols; jX = jX + xCols, jXout = jXout + xCols) {
				xOut[jXout + i] = mean + tmp_contig[jX + i] * scale;
			}
		}
		const outShape = isShapeCoerced ? [xRows] : [xRows, xCols];
		return sm.tensor(xOut).reshape(outShape);
	}
}

function incrementalMeanVar(
	x: sm.Tensor,
	lastMean: sm.Tensor,
	lastVariance: sm.Tensor,
	lastSampleCount: number
) {
	/**
	 * old = stats until now
	 * new = the current increment
	 * updated = the aggregated stats
	 */
	const dtype = x.dtype,
		[newSampleCount, nFeatures] = x.shape;

	// lastSum = lastMean * lastSampleCount
	const lastSum = lastMean.copy().mul(sm.scalar(lastSampleCount).astype(dtype));

	// new sum
	let newSum = sm.tensor(new Float64Array(nFeatures).fill(0)).astype(dtype);
	for (let i = 0; i < newSampleCount; i++) {
		const slice = x.index([i, ':']).astype(dtype);
		newSum = newSum.add(slice);
	}

	const updatedSampleCount = lastSampleCount + newSampleCount,
		updatedCountTensor = sm.scalar(updatedSampleCount).astype(dtype);

	// updatedMean = (lastSum + newSum) / updatedSampleCount
	const updatedMean = lastSum.add(newSum).div(updatedCountTensor);

	// newUnnormalizedVariance = X.var(axis=0) * newSampleCount
	let newUnnormalizedVariance = sm.tensor(new Float64Array(nFeatures).fill(0)).astype(dtype),
		updatedUnnormalizedVariance: sm.Tensor;

	const newMean = newSum.div(sm.scalar(newSampleCount).astype(dtype));

	let tmp: sm.Tensor;
	for (let i = 0; i < newSampleCount; i++) {
		const rowSlice = x.index([i, ':']).astype(dtype);
		tmp = rowSlice.sub(newMean);
		tmp = tmp.mul(tmp);
		newUnnormalizedVariance = newUnnormalizedVariance.add(tmp);
	}

	if (lastSampleCount == 0) {
		// avoid division by 0
		updatedUnnormalizedVariance = newUnnormalizedVariance.copy();
	} else {
		const lastOverNewCount = lastSampleCount / newSampleCount,
			lastOverNewTensor = sm.scalar(lastOverNewCount).astype(dtype);

		let lastUnnormalizedVariance = lastVariance.copy();
		lastUnnormalizedVariance = lastUnnormalizedVariance.mul(lastOverNewTensor);

		/**
		 * updatedUnnormalizedVariance = (
		 *    lastUnnormalizedVariance +
		 *    newUnnormalizedVariance +
		 *    lastOverNewCount / updatedSampleCount *
		 *    (lastSum / lastOverNewCount - newSum) ** 2)
		 */
		tmp = lastSum.copy();
		tmp = tmp.div(lastOverNewTensor);
		tmp = tmp.add(newSum);
		tmp = tmp.matmul(tmp);
		tmp = tmp.mul(sm.scalar(lastOverNewCount / updatedSampleCount).astype(x.dtype));
		updatedUnnormalizedVariance = lastUnnormalizedVariance.copy();
		updatedUnnormalizedVariance = updatedUnnormalizedVariance.add(newUnnormalizedVariance);
		updatedUnnormalizedVariance = updatedUnnormalizedVariance.add(tmp);
	}
	// updatedVariance = updatedUnnormalizedVariance / updatedSampleCount
	let updatedVariance = updatedUnnormalizedVariance.copy();
	updatedVariance = updatedVariance.div(updatedCountTensor);
	return { updatedMean, updatedVariance, updatedSampleCount };
}
