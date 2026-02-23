const { Kafka } = require('kafkajs');
const Product = require('./mongo');

let totalEventsProcessed = 0;
let lastProcessedOffset = 0;

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'read-group' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return; // tombstone

      const payload = JSON.parse(message.value.toString());
      const after = payload.payload.after;

      if (!after) return;

      await Product.updateOne(
        { _id: after.id },
        {
          $set: {
            name: after.name,
            price: after.price,
            category: after.category,
            stock: after.stock,
            deleted_at: after.deleted_at
          }
        },
        { upsert: true }
      );

      totalEventsProcessed++;
      lastProcessedOffset = message.offset;
    }
  });
}

module.exports = { startConsumer, stats: () => ({ totalEventsProcessed, lastProcessedOffset }) };