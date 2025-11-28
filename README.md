# Architecture Overview
<!-- TEST_BADGES_START -->
![Tests](https://img.shields.io/badge/tests-264-brightgreen)
<!-- TEST_BADGES_END -->


This document contains a high-level architecture diagram for a typical web application platform.

The diagram shows the main components and their interactions: clients, edge/network, API & services, data stores, messaging, background workers, and observability.

```mermaid
flowchart LR
  %% Clients
  subgraph Clients
    direction TB
    WebApp["Web App - browser"]
    MobileApp["Mobile App - native"]
  end

  %% Edge / Network
  subgraph Edge
    direction TB
    CDN["CDN - static assets"]
    LB["Load Balancer"]
    APIGW["API Gateway - WAF"]
  end

  %% Authentication
  subgraph AuthLayer
    direction TB
    Auth["Auth Service - OAuth JWT"]
  end

  %% Application services
  subgraph Services
    direction TB
    UserSvc["User Service"]
    OrderSvc["Order Service"]
    PaymentSvc["Payment Service"]
    SearchSvc["Search Service"]
  end

  %% Background processing
  subgraph Workers
    direction TB
    Worker["Background Workers"]
  end

  %% Messaging & Streams
  subgraph Messaging
    direction TB
    Broker["Message Broker - Kafka RabbitMQ"]
  end

  %% Data stores
  subgraph Data
    direction TB
    Cache["Cache - Redis"]
    PrimaryDB["Primary DB - PostgreSQL MySQL"]
    ReadReplica["Read Replicas"]
    ObjectStore["Object Storage - S3"]
  end

  %% Observability
  subgraph Observability
    direction TB
    Logs["Logging"]
    Metrics["Metrics - Prometheus"]
    Traces["Tracing - Jaeger"]
  end

  %% Client -> Edge
  WebApp -->|HTTPS Assets| CDN
  MobileApp -->|HTTPS API| APIGW
  CDN --> LB
  LB --> APIGW

  %% Gateway to Auth & Services
  APIGW -->|Auth token validation| Auth
  APIGW -->|API requests| UserSvc
  APIGW -->|API requests| OrderSvc
  APIGW -->|API requests| PaymentSvc
  APIGW -->|API requests| SearchSvc

  %% Services -> Data
  UserSvc -->|read write| PrimaryDB
  OrderSvc -->|read write| PrimaryDB
  PaymentSvc -->|read write| PrimaryDB
  PrimaryDB --> ReadReplica
  UserSvc --> Cache
  OrderSvc --> Cache
  SearchSvc -->|indexing| ObjectStore

  %% Services -> Messaging -> Workers
  OrderSvc -->|publish events| Broker
  PaymentSvc -->|publish events| Broker
  Broker -->|consume| Worker
  Worker -->|write results| PrimaryDB
  Worker -->|store files| ObjectStore

  %% Observability connections
  UserSvc -.->|telemetry| Logs
  OrderSvc -.->|telemetry| Logs
  PaymentSvc -.->|telemetry| Logs
  Worker -.->|telemetry| Logs
  UserSvc -.->|telemetry| Metrics
  OrderSvc -.->|telemetry| Metrics
  PaymentSvc -.->|telemetry| Metrics
  UserSvc -.->|telemetry| Traces
  OrderSvc -.->|telemetry| Traces
  PaymentSvc -.->|telemetry| Traces
```

## Component Summary

- **Clients**: Web and mobile applications used by end users.
- **Edge**: CDN for static assets, Load Balancer for traffic distribution, API Gateway for routing and WAF.
- **Auth Service**: Centralized authentication and authorization using OAuth and JWT.
- **Services**: Microservices (User, Order, Payment, Search) handling domain logic.
- **Messaging**: Event bus/message broker for decoupled async communication.
- **Workers**: Background processors for long-running jobs, retries, and batch work.
- **Data**: Primary relational database with read replicas, Redis cache for hot data, and object storage for files.
- **Observability**: Central logging, metrics, and tracing to monitor health and diagnose issues.

---


---


---


---

## 📊 Test Summary

![Tests](https://img.shields.io/badge/tests-264-brightgreen)

- **Total tests:** 264

