import * as tf from '@tensorflow/tfjs';
import { OOV_INDEX, padSequences } from './sequence_utils';

export const HOSTED_URLS = {
  model:
    'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
  metadata:
    'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json',
};

export const LOCAL_URLS = {
  model: './resources/model.json',
  metadata: './resources/metadata.json',
};

export class SentimentPredictor {
  async init(urls) {
    console.log('init');
    this.urls = urls;
    this.model = await this.loadHostedPreTrainedModel(urls.model);
    await this.loadMetadata();
    console.log('model loaded');
  }

  async loadHostedPreTrainedModel(url) {
    try {
      const model = await tf.loadLayersModel(url);
      return model;
    } catch (err) {
      console.error(err);
    }
  }

  async loadMetadata() {
    try {
      const metadataJson = await fetch(this.urls.metadata);
      const metadata = await metadataJson.json();

      this.indexFrom = metadata['index_from'];
      this.maxLen = metadata['max_len'];
      this.wordIndex = metadata['word_index'];
      this.vocabularySize = metadata['vocabulary_size'];
    } catch (err) {
      console.error(err);
    }
  }

  predict(text) {
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
    const paddedSequence = padSequences([sequence], this.maxLen);
    const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);

    const beginMs = performance.now();
    const predictOut = this.model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();
    const endMs = performance.now();

    return { score: score, elapsed: endMs - beginMs };
  }
}
