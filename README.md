# TravelSphere – Cloud-Native Tourism & Smart Itinerary Management Platform

TravelSphere is an intelligent, scalable travel recommendation engine architected on a microservices-inspired paradigm. By leveraging a stateless algorithmic scoring system, it instantly matches users with global destinations tailored to their budget, climate preferences, and travel styles.

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white" alt="Jenkins" />
  <img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana" />
  <img src="https://img.shields.io/badge/Nagios-4D4D4D?style=for-the-badge&logo=nagios&logoColor=white" alt="Nagios" />
</div>

<br />

## 🏛️ System Architecture

```mermaid
graph TD
    Client[Client Browser / Mobile] -->|HTTPS| Nginx[NGINX Reverse Proxy & Frontend]
    
    subgraph k8s [Kubernetes Cluster]
        Nginx -->|REST API Calls| Backend[Spring Boot API Service]
        
        subgraph obs [Observability]
            Backend -->|Metrics| Prometheus
            Prometheus --> Grafana[Grafana Dashboards]
            Nagios[Nagios Checks] -.-> Backend
        end
    end
    
    Backend -->|NoSQL Queries| MongoDB[(MongoDB Atlas)]
    
    subgraph cicd [CI/CD Pipeline]
        GitHub[GitHub Repo] -->|Webhook| Jenkins[Jenkins Automation Server]
        Jenkins -->|Build Images| DockerHub[Docker Hub Registry]
        Jenkins -->|Apply Manifests| k8s
    end
```

## 🚀 Key Engineering Features

- **Stateless Algorithmic Recommendation Engine**: A high-performance scoring algorithm embedded in the Java backend dynamically evaluates and ranks destinations against user-defined weights (budget limits, travel style vectors, and climate profiles) with sub-second latency.
- **JWT Role-Based Access Control (RBAC)**: Secure, stateless authentication utilizing signed JSON Web Tokens. Administrative routes and sensitive user endpoints are strictly gated via Spring Security context authorization.
- **Observability Pipeline & Metrics**: Complete application telemetry via Spring Boot Actuator, visualized through a Prometheus-to-Grafana pipeline, complemented by Nagios active polling for guaranteed API uptime and performance SLA monitoring.
- **Containerized DevOps Lifecycle**: Fully isolated execution environments via multi-stage Dockerfiles, automatically built and deployed to a local Kubernetes cluster utilizing automated Jenkins pipelines.

## 🛠️ Quick Start

To spin up the entire application stack locally using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/aadikp/TravelSphere.git
cd TravelSphere

# Spin up the infrastructure
docker compose up -d --build
```

The frontend application will be instantly available at `http://localhost:5173`, successfully proxying requests to the backend Spring Boot container.


