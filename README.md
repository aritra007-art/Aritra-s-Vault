# Aritra's Vault: Distributed Object Storage & Consensus Engine

A fault-tolerant distributed object storage system inspired by Amazon S3 and MinIO with multi-node replication, SHA-256 integrity verification, automated self-healing, bitrot scrubber, and quorum consensus.

The system supports two distinct architectural operational modes:
1. **LOCAL DEMO MODE**: 4 independent local storage node HTTP daemons (`:5001`, `:5002`, `:5003`, `:5004`), filesystem storage under `storage/node1` through `storage/node4`, and embedded SQLite metadata. Demonstrates genuine physical hardware failure and network partition.
2. **CLOUD / VERCEL MODE**: Managed persistent Supabase PostgreSQL database metadata and Supabase Storage (`vault-objects` bucket) organized across 4 logical replica domains (`node-1/{id}`, `node-2/{id}`, etc.).

---

## Architecture Modes

| Feature | LOCAL DEMO (`DATABASE_MODE=sqlite`, `STORAGE_MODE=local`) | CLOUD / VERCEL (`DATABASE_MODE=supabase`, `STORAGE_MODE=supabase`) |
| :--- | :--- | :--- |
| **Node Execution** | 4 genuine independent HTTP storage servers on ports 5001-5004 | 4 logical replica placement domains on Supabase Storage |
| **Storage Backend** | Real local filesystem directories (`storage/node1..4`) | Supabase Storage bucket (`vault-objects`) |
| **Metadata DB** | Embedded SQLite (`storage/vault_metadata.sqlite.json`) | Cloud PostgreSQL on Supabase (`objects`, `replicas`, etc.) |
| **Bitrot Scrubbing** | Mutates bytes in local filesystem files & verifies SHA-256 | Mutates bytes in Supabase Storage replica path & verifies SHA-256 |
| **Quorum Self-Healing**| Reconstructs replica between node directories | Reconstructs replica between Supabase Storage domain paths |
| **Primary Use Case** | Hackathon live demonstration of node failures & partitions | Persistent cloud deployment on Vercel / serverless |

> **Important Architectural Disclosure**: In Cloud mode, the 4 node IDs (`node-1` through `node-4`) represent logical replica domains rather than physically isolated hardware servers. For genuine independent hardware/process failure demonstration, use Local Demo mode.

---

## Quickstart: Local Development Mode

Start the Coordinator API, the 4 independent storage node daemons, and the React frontend simultaneously:

```bash
npm run vault:dev
```

This starts:
- **Coordinator & UI**: `http://localhost:3000`
- **Storage Node 1**: `http://localhost:5001` (`storage/node1/`)
- **Storage Node 2**: `http://localhost:5002` (`storage/node2/`)
- **Storage Node 3**: `http://localhost:5003` (`storage/node3/`)
- **Storage Node 4**: `http://localhost:5004` (`storage/node4/`)

---

## Cloud / Supabase / Vercel Deployment

### 1. Database Setup in Supabase
Run the migration located in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor:
- Creates `objects`, `replicas`, `activities`, `repair_tasks`, and `cluster_config` tables.
- Sets up primary keys, foreign keys, constraints, and indexes.

### 2. Storage Setup in Supabase
In your Supabase Dashboard:
1. Navigate to **Storage** ➔ **New bucket**.
2. Name the bucket `vault-objects` (Private).

### 3. Environment Variables
Configure the following in your Vercel project settings or `.env`:

```env
DATABASE_MODE=supabase
STORAGE_MODE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
SUPABASE_ANON_KEY=your-supabase-anon-key
```

*Note: `SUPABASE_SERVICE_ROLE_KEY` is server-only and is NEVER exposed to the frontend browser bundle.*

---

## Verification & Commands

```bash
# Check TypeScript types
npm run lint

# Build production bundle
npm run build

# Start local full-stack cluster
npm run vault:dev
```
## Testing & Validation

Vault was tested locally using the multi-service distributed storage architecture consisting of a Coordinator API and four independent storage nodes.

### Local Test Environment

```text
React / Vite Frontend
        │
        ▼
Coordinator API :3000
        │
        ├── Storage Node 1 :5001
        ├── Storage Node 2 :5002
        ├── Storage Node 3 :5003
        └── Storage Node 4 :5004

The local environment was started using:

npm install
npm run vault:dev

The system was configured with:

DATABASE_MODE=sqlite
STORAGE_MODE=local
1. Object Upload & Storage

A test object was uploaded through the Vault web interface with a configurable replication factor.

The uploaded file was verified in the individual node storage directories:

storage/
├── node1/
├── node2/
├── node3/
└── node4/

The physical presence of the object on multiple nodes was checked to confirm replica creation.

2. Replica Verification

Objects were uploaded with a replication factor of 3.

The system was verified to:

Select multiple healthy storage nodes.
Store actual object bytes on the selected nodes.
Maintain replica metadata in the database.
Report the current replica health and status through the dashboard.
3. Node Failure & Failover

A storage node was intentionally failed using the Vault failure-simulation functionality.

The system was tested to verify that:

The failed node was detected by the Coordinator.
The affected object became temporarily under-replicated.
The failed node was excluded from normal retrieval.
The object could still be downloaded from a healthy replica.
4. Automatic Replica Repair

After intentionally failing a node, the automatic self-healing mechanism was observed.

The repair process was verified to:

Detect the missing replica.
Select a healthy source replica.
Select another available storage node.
Transfer the object data.
Verify the SHA-256 checksum.
Update replica metadata.
Restore the required replication factor.
5. Data Corruption & Integrity Verification

Replica corruption was simulated on a storage node.

The integrity verification system was then used to:

Read the actual stored object bytes.
Calculate the SHA-256 checksum.
Compare it against the canonical object checksum.
Detect the corrupted replica.
Mark the replica as unhealthy.
Trigger replica repair.

After repair, the replica checksum was verified against the canonical checksum.

6. Network Partition Testing

Network isolation was simulated for an individual storage node.

The system was tested to ensure that:

The Coordinator recognized the node as unavailable.
The isolated node was excluded from normal retrieval.
Healthy replicas remained available.
Objects could still be retrieved from reachable replicas.
The node could subsequently be recovered.
7. Node Recovery

A previously failed/isolated node was recovered and its state was checked against the cluster metadata.

The recovery process was tested for:

Node health restoration.
Replica state reconciliation.
Metadata consistency.
Correct replication status after recovery.
8. Rebalancing

The cluster rebalancing functionality was tested by monitoring node utilization and initiating a rebalance operation.

The system was verified to identify under-utilized storage nodes and redistribute replicas while maintaining the required replication level.

9. Metadata Persistence

The local deployment uses SQLite as the authoritative metadata store.

The following information is persisted:

Object metadata
Replica locations
Object versions
Checksums
Activity records
Repair tasks
Cluster configuration
10. Test Summary
Test	Result
Object Upload	✅ Passed
Multi-Node Replication	✅ Passed
Object Retrieval	✅ Passed
Node Failure Detection	✅ Passed
Replica Failover	✅ Passed
Automatic Replica Repair	✅ Passed
SHA-256 Integrity Verification	✅ Passed
Replica Corruption Detection	✅ Passed
Network Partition Simulation	✅ Passed
Node Recovery	✅ Passed
Replica Reconciliation	✅ Passed
Cluster Rebalancing	✅ Passed
Metadata Persistence	✅ Passed
Testing Approach

The testing focused on validating the core requirements of the Vault problem statement rather than only testing the user interface. Particular attention was given to physical object persistence, replica availability, failure handling, checksum-based integrity verification, automatic repair, and metadata consistency.
