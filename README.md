# cdc_products
Implement a Real-Time Data Synchronization Pipeline with Debezium, Kafka, and PostgreSQL

# Real-Time Data Synchronization Pipeline (CDC with Debezium, Kafka, PostgreSQL, MongoDB)

## 📌 Overview

This project implements a **Change Data Capture (CDC)** pipeline using:

- PostgreSQL (Write Database)
- Debezium (CDC Engine)
- Apache Kafka (Event Streaming)
- MongoDB (Read Model)
- Node.js Microservices (Write Service & Read Service)
- Docker Compose (Infrastructure Orchestration)

The system demonstrates a real-world **event-driven microservices architecture** using a CQRS-like pattern.

---

## 🧠 Architecture


Write Service
↓
PostgreSQL (WAL - Logical Replication)
↓
Debezium Connector
↓
Kafka Topic
↓
Read Service (Kafka Consumer)
↓
MongoDB (Denormalized Read Model)


---

## 🎯 Objective

The goal of this project is to:

- Capture real-time database changes using CDC.
- Stream changes reliably using Kafka.
- Maintain a synchronized MongoDB read model.
- Implement idempotent message processing.
- Provide monitoring and reset capabilities.
- Demonstrate a scalable microservices pattern.

This architecture is commonly used in:
- Real-time analytics systems
- Cache invalidation
- Data replication
- Microservice data synchronization
- Event-driven systems

---

## 🔥 Why CDC Instead of Polling?

Traditional polling:
- Inefficient
- High latency
- Heavy database load

CDC:
- Reads PostgreSQL Write-Ahead Log (WAL)
- Low latency
- Minimal DB impact
- Event-driven architecture

Debezium reads WAL directly and streams row-level changes to Kafka.

---

## 📦 Services Overview

### 1️⃣ PostgreSQL
- Primary write database
- Configured for logical replication
- Stores normalized product data

### 2️⃣ Debezium
- Monitors PostgreSQL WAL
- Captures insert/update/delete events
- Publishes events to Kafka

### 3️⃣ Kafka
- Message broker
- Guarantees ordered, durable event streaming
- Provides at-least-once delivery

### 4️⃣ Write Service (Port 8080)
Handles:
- Create Product
- Update Product
- Soft Delete Product

Writes only to PostgreSQL.

### 5️⃣ Read Service (Port 8081)
- Consumes Kafka events
- Updates MongoDB read model
- Provides search & monitoring APIs
- Implements idempotent consumer

### 6️⃣ MongoDB
- Denormalized read model
- Optimized for fast queries

---

## 🗂 Project Structure


cdc-products/
│
├── docker-compose.yml
├── schema.sql
├── setup-debezium.sh
├── env.example
├── README.md
│
├── write-service/
└── read-service/


---

# 🚀 How to Run the Project

## ✅ Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd cdc-products
✅ Step 2: Start Infrastructure
docker compose up --build -d

Wait until all services are healthy.

Check status:

docker compose ps

All services must be running.

✅ Step 3: Register Debezium Connector
chmod +x setup-debezium.sh
./setup-debezium.sh

Verify connector:

curl http://localhost:8083/connectors/products-connector/status

Status should show:

"state": "RUNNING"
🧪 API Testing
📝 Create Product
POST http://localhost:8080/api/products

Body:

{
  "name": "Laptop Pro",
  "price": 1500,
  "category": "Electronics",
  "stock": 10
}

Response: 201 Created

✏️ Update Product
PUT http://localhost:8080/api/products/1
❌ Soft Delete Product
DELETE http://localhost:8080/api/products/1

This sets deleted_at timestamp in PostgreSQL.

🔎 Read Service APIs
🔍 Search Products
GET http://localhost:8081/api/products/search?query=Pro

Performs case-insensitive search on name & category.

📂 Filter by Category
GET http://localhost:8081/api/products/category/Electronics
📊 Sync Status
GET http://localhost:8081/api/sync/status

Response:

{
  "consumerLag": 0,
  "lastProcessedOffset": 25,
  "totalEventsProcessed": 25
}
🔁 Reset Offset (Rebuild Read Model)
POST http://localhost:8081/api/sync/reset

Replays events from beginning.

🔄 How Synchronization Works

Write Service inserts into PostgreSQL.

PostgreSQL writes change to WAL.

Debezium reads WAL.

Debezium emits event to Kafka topic.

Read Service consumes event.

MongoDB is updated using upsert.

Read APIs serve data from MongoDB.

This ensures:

Loose coupling

Real-time sync

Independent scaling

Fault tolerance

🛡 Idempotency Strategy

Kafka provides at-least-once delivery.

This means duplicate messages may occur.

To prevent duplication:

MongoDB uses _id = product.id

Consumer uses updateOne(..., { upsert: true })

Result:

No duplicate documents

Safe reprocessing

Consistent read model

🗑 Soft Delete vs Tombstone

Soft Delete:

Updates deleted_at column

Debezium emits update event

Hard Delete:

Emits delete event

Followed by tombstone (null payload)

Consumer handles:

Update events

Tombstone events safely

📈 Production Considerations

In real production systems you would add:

Schema Registry (Avro/Protobuf)

Dead Letter Queue (DLQ)

Prometheus + Grafana monitoring

Consumer lag metrics

Retry handling

Partition scaling

Multiple Kafka brokers

Authentication & TLS

🧩 Why This Architecture Matters

This pattern is widely used at scale by companies like:

Netflix

Uber

Amazon

Airbnb

It enables:

Real-time analytics

Event-driven microservices

Horizontal scalability

Database isolation

Data consistency without tight coupling

🧪 Verification Checklist

✔ All containers start successfully
✔ Debezium connector is RUNNING
✔ Product creation appears in MongoDB
✔ Updates reflect in MongoDB
✔ Soft deletes propagate
✔ No duplicate documents on reprocessing
✔ Search & category filters work
✔ Sync status endpoint updates counters

🧠 Key Concepts Demonstrated

Change Data Capture (CDC)

Event-Driven Architecture

CQRS Pattern

Idempotent Consumer Design

Kafka Consumer Offset Management

Logical Replication in PostgreSQL

Microservices Decoupling

🏁 Final Notes

This project demonstrates real-world distributed system design principles:

Loose coupling

Event streaming

Read/write separation

Horizontal scalability

Fault tolerance

It reflects production-grade architectural thinking rather than simple CRUD development.
