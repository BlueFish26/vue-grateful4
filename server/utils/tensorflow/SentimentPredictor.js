const tf = require('@tensorflow/tfjs-node');
const { OOV_INDEX, padSequences } = require('./sequence_utils');
const axios = require('axios').default;
const { performance } = require('perf_hooks');

class SentimentPredictor {
  async init(urls) {
    console.log('init', urls);
    this.urls = urls;
    this.model = await this.loadHostedPreTrainedModel(urls.model);
    await this.loadMetadata();
    console.log('models loaded');
  }

  async loadHostedPreTrainedModel(url) {
    try {
      console.log('Loading Models', url);
      const model = await tf.loadLayersModel(url);
      return model;
    } catch (err) {
      console.error(err);
    }
  }

  async loadMetadata() {
    try {
      console.log('Loading Metadata', this.urls.metadata);
      const response = await axios.get(this.urls.metadata);
      //const metadata = await metadataJson.json();
      const metadata = response.data;
      this.indexFrom = metadata.index_from;
      this.maxLen = metadata.max_len;
      this.wordIndex = metadata.word_index;
      this.vocabularySize = metadata.vocabulary_size;
    } catch (err) {
      console.error(err);
    }
  }

  predict(text) {
    console.log(text);
    // Convert to lower case and remove all punctuations.
    const inputText = text
      .trim()
      .toLowerCase()
      .replace(/(\.|\,|\!)/g, '')
      .split(' ');
    // Convert the words to a sequence of word indices.
    const sequence = inputText.map((word) => {
      let wordIndex = this.wordIndex[word] + this.indexFrom;
      if (wordIndex > this.vocabularySize) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    // Perform truncation and padding.
    console.log('sequence', sequence);
    const paddedSequence = padSequences([sequence], this.maxLen);
    console.log(paddedSequence);
    const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);
    const beginMs = performance.now();
    const predictOut = this.model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    const endMs = performance.now();

    return { score: score, elapsed: endMs - beginMs };
  }
}
module.exports = SentimentPredictor;
