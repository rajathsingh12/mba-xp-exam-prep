# Session 5: Data Warehouses, Data Lakes & the Modern Lakehouse — Plain English

[Source: M2 S5]

**Module 2 — Big Data Architecture & Technologies** | Session 5 of 5 | Slides 33–48 | Duration ≈ 3 hours

---

## Table of Contents

1. [Cloud Computing for Big Data](#1-cloud-computing-for-big-data)
2. [Data Warehouse Architecture](#2-data-warehouse-architecture)
3. [Star Schema & Snowflake Schema](#3-star-schema--snowflake-schema)
4. [Data Lake Architecture](#4-data-lake-architecture)
5. [Modern Lakehouse Architecture](#5-modern-lakehouse-architecture)
6. [Delta Lake & ACID Transactions on Data Lakes](#6-delta-lake--acid-transactions-on-data-lakes)
7. [Schema-on-Write vs Schema-on-Read](#7-schema-on-write-vs-schema-on-read)
8. [Business Problem #4 — Healthcare Patient Readmission](#8-business-problem-4--healthcare-patient-readmission)
9. [Decision Framework — Warehouse vs Lake vs Lakehouse](#9-decision-framework--warehouse-vs-lake-vs-lakehouse)
10. [The Cost & Governance Lens](#10-the-cost--governance-lens)
11. [Visual Aids](#11-visual-aids)
12. [Session Summary](#12-session-summary)
13. [Key Takeaways](#13-key-takeaways)

---

## 1. Cloud Computing for Big Data

### In short

Cloud computing means buying computing power over the internet and paying only for what you use, instead of buying servers and running your own data centre.

### Why does it matter?

Before the cloud, every organisation that wanted to run big data workloads had to buy, rack, and maintain its own servers. Capacity planning — deciding how much computing power to buy and keep on standby — was a guessing game. Buy too little and your Spark jobs queue for hours. Buy too much and expensive hardware sits idle at 10 % utilisation for 50 weeks of the year. Cloud computing exists to break that link between capacity and capital expenditure. It turns infrastructure into a utility, like electricity: you use it in proportion to real demand and pay by the minute or the gigabyte. For big data this is transformational. A retailer can spin up a 500-node Spark cluster for a two-hour year-end analytics run, then shut it down and pay only for those two hours. [Source: M2 S5, slide 33]

### How it works in practice

1. **Resource provisioning.** Pick a cloud provider (AWS, Azure, or GCP) and set up virtual resources — compute instances, storage buckets, managed databases — through a web console, CLI, or infrastructure-as-code templates.
2. **Service model selection.** Choose how much the provider manages for you:
   - **IaaS (Infrastructure as a Service):** Raw virtual machines, storage, and networking. You manage the OS, middleware, and applications. *Examples: AWS EC2, Azure VMs, Google Compute Engine.* [Source: M2 S5, slide 34]
   - **PaaS (Platform as a Service):** A managed platform with the OS, runtime, and development tools already set up. You deploy application code without managing servers. *Examples: Google App Engine, Azure App Service, AWS Elastic Beanstalk, Heroku.* [Source: M2 S5, slide 34]
   - **SaaS (Software as a Service):** Fully managed applications you open in a web browser. *Examples: Salesforce, Google Workspace, Microsoft 365, Dropbox.* [Source: M2 S5, slide 34]
3. **Elastic scaling.** Auto-scaling rules add or remove compute nodes based on workload metrics (CPU utilisation, queue depth, request latency).
4. **Data storage.** Data lands in cloud object stores — cheap online storage for files, sold by the gigabyte — such as Amazon S3, Azure Data Lake Storage, or Google Cloud Storage, which offer virtually unlimited capacity at commodity prices.
5. **Managed analytics services.** The provider offers pre-configured big data services — Amazon EMR for Spark, Google Dataproc, Azure HDInsight, Databricks, Snowflake — so teams run analytics without cluster administration.
6. **Pay-as-you-go billing.** Usage is metered per second, per query, or per terabyte scanned. Unused resources cost nothing once you terminate them.

### Analogy

Cloud computing is like a hotel instead of owning a house. Own a house (on-premise data centre) and you pay the full mortgage whether guests come or not, you maintain the plumbing yourself, and expanding means a costly renovation. A hotel (cloud) lets you book exactly the rooms you need for exactly the nights you need them, and the staff handle maintenance, cleaning, and security. If the family reunion doubles in size, you simply book more rooms — no construction required. The follow-through: IaaS is renting an unfurnished apartment (you bring your own furniture and OS); PaaS is a serviced apartment (furniture included, just move in); SaaS is room service (everything is done for you, you just consume).

### Real-world example

[Source: M2 S5, slide 34]

A mid-sized e-commerce company used to run its product-recommendation engine on a 20-node on-premise Hadoop cluster that cost $400,000 in capital expenditure and needed two full-time administrators. After moving to AWS EMR with spot instances, the company spins up a 50-node cluster every night for the recommendation-model training job (about three hours), then terminates it. Monthly cloud spend is $8,000 — a fraction of the annualised on-premise cost — and the engineering team eliminated the administrator role, redirecting those salaries to data science.

### Pros and cons

| Pros | Cons |
|------|------|
| **Cost model.** Pay-as-you-go turns CapEx into OpEx; no upfront hardware purchase | Costs can spiral if resources are left running or workloads are poorly optimised ("cloud surprise bills") |
| **Scalability.** Elastic scaling up to thousands of nodes in minutes | Scaling down needs careful orchestration to avoid data loss during job execution |
| **Speed to market.** Managed services (EMR, Dataproc, BigQuery) remove weeks of cluster setup | Vendor lock-in: moving between providers is non-trivial once you depend on proprietary services |
| **Maintenance.** The provider handles hardware failures, OS patching, and security updates | The shared-responsibility model means you still own application-level security and data governance |
| **Global reach.** Data centres in 30+ regions give low-latency access worldwide | Data sovereignty and compliance rules (GDPR; HIPAA, the US law protecting patient health-data privacy) may restrict where data can be stored |

### Why it matters for managers

Cloud computing changes the economics of data-driven decisions. Before the cloud, only large enterprises could afford the infrastructure for petabyte-scale analytics. Today a five-person startup can access the same computing power on demand. For managers that means faster experiment cycles (spin up, test, tear down), a lower barrier to adopting big data, and the ability to scale analytics spending in line with proven business value rather than speculative capacity planning. It also means cloud-cost governance has to sit inside the operating model — budgets, alerts, auto-shutdown policies — because the ease of provisioning is also the ease of overspending.

### Exam-ready definition

> Cloud computing is the on-demand delivery of IT resources (compute, storage, networking) over the internet on pay-as-you-go pricing, allowing elastic scaling without upfront capital expenditure.

---

## 2. Data Warehouse Architecture

### In short

A data warehouse is one central store of structured, processed data, built for fast analytical querying and business intelligence (BI) reporting. Data must fit a predefined schema (a fixed table structure) before it is loaded — that is schema-on-write.

### Why does it matter?

Operational databases (the systems that run your ERP, CRM, and point-of-sale) are designed for fast transactional writes — inserting an order, updating inventory. They are terrible at answering analytical questions like "What were our top-selling products by region last quarter?" because those queries scan millions of rows across multiple tables, which would cripple the transactional system. A data warehouse exists to separate analytical workloads from operational ones. Data is extracted from source systems, transformed into a clean, consistent format, and loaded into a structure designed for aggregation and reporting. That split protects operational performance and gives analysts a single, trusted source of truth. [Source: M2 S5, slide 35]

### How it works in practice

1. **Extract.** Data is pulled from different source systems — ERP (SAP, Oracle), CRM (Salesforce), transactional databases, flat files — on a scheduled basis (nightly, hourly). [Source: M2 S5, slide 35]
2. **Transform.** Raw data is cleaned, deduplicated, type-cast, and conformed to the warehouse schema, and business rules are applied (currency conversion, fiscal calendar mapping). In traditional ETL (Extract, Transform, Load — transform before you load), transformation happens in a staging area before loading. In modern ELT (Extract, Load, Transform — load first, transform inside), raw data is loaded first and the warehouse's own compute engine does the transformation.
3. **Load.** Transformed data is written into the warehouse using schema-on-write: every row must match the predefined column types, constraints, and relationships before it is accepted.
4. **Schema design.** Data is organised into fact tables (rows of quantitative measures — sales amount, quantity, cost) and dimension tables (descriptive context — product name, customer region, date). The two primary designs are the star schema and snowflake schema (covered in the next concept).
5. **Columnar storage.** Modern warehouses (Redshift, BigQuery, Snowflake) store data in columnar format rather than row-based. That accelerates aggregate queries (SUM, AVG, COUNT) because the engine reads only the columns named in the query and skips the rest. [Source: M2 S5, slide 35]
6. **BI consumption.** Analysts and dashboards (Tableau, Power BI, Looker) connect to the warehouse via SQL, running repeated, well-defined queries against curated datasets.

### Analogy

A data warehouse is like a well-organised reference library. Raw data from operational systems is like a chaotic pile of handwritten notes, receipts, and letters arriving at the library's back door every day. The librarian (the ETL process) reads each document, classifies it by subject (fact or dimension), formats it according to the library's cataloguing rules (schema-on-write), and shelves it in the correct section. A researcher (analyst) can then walk to the "Sales" aisle and find every fact neatly indexed by date, product, and region — no rummaging through boxes required. The follow-through: schema-on-write is the cataloguing rules that every document must pass before it earns a spot on the shelf; columnar storage is like organising the shelf by chapter topic rather than by book, so a researcher studying "pricing" can pull every pricing chapter from every book in one sweep without opening irrelevant chapters.

### Real-world example

[Source: M2 S5, slide 35]

A national retail chain loads point-of-sale transactions, inventory levels, and supplier shipment data into an Amazon Redshift warehouse every night. The marketing team runs a Tableau dashboard each Monday morning that shows week-over-week same-store sales by region, broken down by product category. Because the data has been cleaned and conformed during the nightly ETL run, every dashboard consumer trusts that "revenue" means the same thing across all 200 stores — a guarantee that would be impossible if each analyst queried the raw operational databases directly with their own ad-hoc transformations.

### Pros and cons

| Pros | Cons |
|------|------|
| **Data quality.** Schema-on-write enforces consistency and type safety before data enters the system | Schema changes (adding a column, changing a type) require migration scripts and downtime |
| **Query performance.** Columnar storage and indexing deliver sub-second response on well-tuned aggregate queries | Performance degrades on ad-hoc, exploratory queries that span many tables or require full scans |
| **BI integration.** A native SQL interface connects directly to every major BI tool | Limited to structured, tabular data — it cannot store images, video, logs, or free text efficiently |
| **Governance.** Strong access control, audit logging, and data lineage tracking | High storage cost for large data volumes compared with object stores |
| **Maturity.** Decades of best practices, tooling, and available talent | Not designed for machine learning workloads that need raw, granular data |

### Why it matters for managers

The data warehouse remains the backbone of enterprise reporting. When the CFO asks "What were last quarter's revenues by business unit?", the answer comes from the warehouse — not from a data lake, not from a spreadsheet. For managers, the warehouse is a governed, auditable single source of truth. Its schema-on-write discipline means data quality problems are caught at ingestion time, not discovered by an executive during a board presentation. The trade-off is rigidity: adding a new data source or changing a metric definition requires coordination between data engineers and business stakeholders, which can take weeks. Managers must weigh that reliability against the agility offered by newer architectures.

### Exam-ready definition

> A data warehouse is a centralised, schema-on-write repository of structured data, designed for fast SQL-based analytical querying and business intelligence reporting, using star or snowflake schemas to organise facts and dimensions.

---

## 3. Star Schema & Snowflake Schema

### In short

A star schema organises warehouse data into a central fact table surrounded by denormalised dimension tables (denormalised means repetition is kept on purpose, instead of splitting data to remove it). A snowflake schema goes further and normalises those dimension tables into sub-dimension tables, cutting redundancy at the cost of extra joins.

### Why does it matter?

Relational database theory teaches normalisation — removing redundancy by splitting data into many small tables. Normalisation is essential for transactional systems (it prevents update anomalies), but it is counterproductive for analytics because every query must join dozens of tables, which is slow. The star schema was invented to strike a pragmatic balance: keep one central fact table for measures and surround it with a small number of wide, denormalised dimension tables. That minimises joins and makes queries intuitive for business users. The snowflake schema exists for situations where dimension tables are very large and contain significant redundancy (for example, a product dimension repeating the same category and subcategory descriptions). Normalising those dimensions saves storage at the cost of extra joins. [Source: M2 S5, slide 35]

### How it works in practice

1. **Identify the business process.** Choose a measurable business event — a sales transaction, a support ticket, a patient admission.
2. **Define the grain.** Decide what one row in the fact table represents — for example, one line item in one sales transaction.
3. **Build the fact table.** Populate it with quantitative measures (sales_amount, quantity, discount) and foreign keys pointing to each dimension.
4. **Build dimension tables.** Each dimension holds descriptive attributes:
   - `dim_product`: product_id, product_name, category, subcategory, brand
   - `dim_customer`: customer_id, name, region, segment
   - `dim_date`: date_key, day_of_week, month, quarter, fiscal_year
   - `dim_store`: store_id, store_name, city, state
5. **Star schema (default).** Each dimension table is denormalised — category and subcategory live directly in `dim_product` even though categories repeat across many products.
6. **Snowflake schema (variant).** The `dim_product` table is normalised: category_id is a foreign key to a separate `dim_category` table, and subcategory_id to `dim_subcategory`. This removes repeated category strings but requires an extra join at query time.
7. **Query execution.** A typical query joins the fact table to two or three dimensions: `SELECT d.region, SUM(f.sales_amount) FROM fact_sales f JOIN dim_store d ON f.store_key = d.store_id GROUP BY d.region`. In a star schema this is one join; in a snowflake schema, if the dimension itself is normalised, the engine must perform sub-joins within the dimension.

### Analogy

Imagine a shipping warehouse with a central dispatch desk (the fact table). Around the desk are labelled shelves: one for customer addresses, one for product catalogues, one for carrier information. In a **star** layout, each shelf contains complete, self-contained information — the product shelf has the product name, category, and subcategory all on one card. Finding a product card is one lookup. In a **snowflake** layout, the product shelf only has the product name and a reference number for its category; to get the category name, you walk to a separate "categories" shelf. This saves space (you write "Electronics" once on the categories shelf instead of repeating it on 5,000 product cards) but requires two lookups instead of one. The follow-through: query performance (star = fewer lookups = faster) versus storage efficiency (snowflake = less repetition = smaller footprint).

### Real-world example

[Source: M2 S5, slide 35]

A telecom company with 40 million subscribers models its call-detail-records warehouse as a star schema. The `fact_calls` table holds call duration, cost, and timestamp with foreign keys to `dim_subscriber`, `dim_tower`, and `dim_date`. Because `dim_subscriber` is denormalised (plan_name, plan_type, and plan_tier live directly on the subscriber record), the BI team can run "average call duration by plan tier by month" with a single two-table join, returning results in under two seconds on Snowflake.

### Star schema vs. snowflake schema

The star schema (left column) is the default choice. The right column shows where the snowflake schema wins — the trade-off you accept when you pick it.

| Aspect | Star Schema | Snowflake Schema |
|---|---|---|
| Query performance | Faster — fewer joins needed | Slower — additional joins for normalised dimensions |
| Storage efficiency | Higher redundancy in dimension tables | Lower redundancy — normalised dimensions save space |
| Query simplicity | Intuitive for business users and BI tools | More complex SQL with multiple joins |
| Maintenance | Denormalised dimensions require wider UPDATE statements when attributes change | Normalised dimensions isolate changes (update the category name in one place) |
| BI tool compatibility | Preferred by most BI tools (Tableau, Power BI auto-detect star schemas) | Some BI tools struggle with deeply normalised hierarchies |
| Best use case | Most analytical workloads; the default choice | Very large dimensions with high attribute redundancy |

### Why it matters for managers

Schema design is not a purely technical decision — it directly affects how quickly the business gets answers. A well-designed star schema means the marketing team can build their own Tableau dashboards without needing a data engineer to write complex joins. A poorly designed schema (or a snowflake schema used unnecessarily) means every new question requires engineering intervention, slowing the insight-to-action cycle. Managers should make sure their data engineering teams default to star schemas unless there is a documented, measurable reason to normalise dimensions further.

### Exam-ready definition

> A star schema is a warehouse design with a central fact table linked to denormalised dimension tables; a snowflake schema normalises those dimensions into sub-tables, trading query simplicity for storage efficiency.

---

## 4. Data Lake Architecture

### In short

A data lake is a centralised storage repository that holds vast amounts of raw data in its native format — structured, semi-structured, and unstructured — and applies a schema only at the time of reading (schema-on-read). That keeps storage cheap and flexible for diverse analytics and machine learning workloads.

### Why does it matter?

Data warehouses require data to be structured and cleaned before loading. But modern organisations generate massive volumes of data that does not fit neatly into rows and columns: server logs, IoT sensor streams, social media posts, medical images, PDF invoices, video surveillance footage. Forcing all of this through an ETL pipeline into a rigid warehouse schema is either impossible (how do you put a chest X-ray into a star schema?) or wasteful (you discard raw detail that a future ML model might need). The data lake exists to store everything in its raw, original format at very low cost, deferring the question of "how should this data be structured?" until someone actually needs to analyse it. This schema-on-read approach trades the warehouse's upfront data quality for maximum flexibility and inclusivity. [Source: M2 S5, slide 36]

### How it works in practice

1. **Ingest.** Data arrives from diverse sources — databases (CDC — change-data-capture — streams), application logs, IoT devices, APIs, file drops — and lands in the **Raw/Landing Zone** in its original format (CSV, JSON, Parquet — an open columnar file format for tables — images, video, free text). No transformation is applied. [Source: M2 S5, slide 36]
2. **Validate and cleanse.** Automated pipelines (Spark jobs, AWS Glue, Azure Data Factory) read data from the raw zone, apply validation rules (null checks, type casting, deduplication), and write clean data to the **Cleansed Zone**. Data that fails validation is quarantined for review. [Source: M2 S5, slide 36]
3. **Curate.** Data engineers and data scientists build business-ready datasets in the **Curated/Consumption Zone** — aggregated tables, feature stores (reusable sets of model inputs) for ML models, denormalised views for BI. This zone often uses columnar formats (Parquet, ORC) and is partitioned by date or business unit for query performance. [Source: M2 S5, slide 36]
4. **Storage layer.** The physical storage is typically a distributed file system or cloud object store: HDFS (Hadoop's distributed file system) for on-premise Hadoop clusters; Amazon S3, Azure Data Lake Storage (ADLS), or Google Cloud Storage (GCS) for cloud deployments. These offer virtually unlimited capacity at $0.02–$0.03 per GB/month. [Source: M2 S5, slide 36]
5. **Processing.** Compute engines — Apache Spark, Presto, Trino, Apache Hive — run queries and transformations directly on lake data. Unlike a warehouse, the compute layer is decoupled from storage, meaning you can scale them independently.
6. **Catalogue and governance.** A metadata catalogue (AWS Glue Data Catalog, Apache Hive Metastore, Databricks Unity Catalog) — an index of what datasets exist, their schemas, their lineage, and who may use them — registers datasets with their structure and access policies. Without this catalogue, the lake degenerates into a **data swamp** — a dumping ground where nobody can find or trust anything. [Source: M2 S5, slide 36]

### Analogy

A data lake is like a massive self-storage facility. Anyone in the organisation can rent a unit (folder/prefix) and dump whatever they want — furniture, boxes of documents, artwork, old appliances — in whatever condition it arrives (raw format, schema-on-read). The facility itself does not inspect or sort the contents; it just provides cheap, abundant space. When someone needs a specific item, they go to the unit, open the box, and figure out what is inside at that moment (schema-on-read). The follow-through: the Raw Zone is the loading dock where moving trucks drop off unsorted boxes; the Cleansed Zone is a staging area where a hired organiser has labelled and inventoried the boxes; the Curated Zone is a neatly arranged showroom where items are displayed by category for easy browsing. Without the organiser (data governance), the facility becomes a hoarder's nightmare — a data swamp.

### Real-world example

[Source: M2 S5, slide 36]

A ride-sharing company ingests GPS traces (semi-structured JSON), driver ratings (structured CSV exports), customer support chat transcripts (unstructured text), and dashcam footage (unstructured video) into an S3-based data lake. The data science team reads GPS traces from the curated zone to build an ETA prediction model; the safety team reads dashcam metadata to flag high-risk driving events; the BI team queries aggregated ride metrics for executive dashboards. A single warehouse could not store the video or free-text chat data, but the data lake accepts all formats at a fraction of the cost.

### Pros and cons

| Pros | Cons |
|------|------|
| **Data diversity.** Stores structured, semi-structured, and unstructured data in native formats | No schema enforcement on write — garbage in, garbage stays |
| **Cost.** Object storage is 10–100x cheaper per GB than warehouse storage | Low-cost storage encourages indiscriminate dumping, leading to data swamps |
| **Flexibility.** Schema-on-read allows the same data to be used for different purposes with different schemas | Analysts must understand the raw format; higher skill barrier than querying a warehouse |
| **Scalability.** Cloud object stores scale to exabytes with no capacity planning | Without partitioning and cataloguing, query performance on large datasets is poor |
| **ML support.** Raw, granular data is ideal for feature engineering and model training | Lacks ACID transactions (all-or-nothing, consistent, isolated, durable database writes) — concurrent writes can produce corrupt or inconsistent reads |
| **Governance.** Metadata catalogues provide discoverability and lineage | Governance is opt-in, not enforced by default; requires deliberate investment |

### Why it matters for managers

The data lake is the foundation of modern data science. Any organisation that wants to train machine learning models needs access to raw, granular data — and that data lives in the lake, not in a warehouse that has already aggregated it away. For managers, the critical decision is not whether to build a data lake (most already have one) but how to govern it. A data lake without governance — without a catalogue, without access controls, without data quality monitoring — rapidly becomes a liability: teams cannot find data, cannot trust data, and waste weeks re-cleaning the same datasets. The manager's role is to fund and mandate governance from day one, not as a retrofit.

### Exam-ready definition

> A data lake is a centralised repository that stores raw data in its native format using schema-on-read, built on HDFS or cloud object storage, supporting diverse analytics from BI to machine learning at low cost.

---

## 5. Modern Lakehouse Architecture

### In short

A lakehouse is a data architecture that combines the low-cost, flexible, multi-format storage of a data lake with the data management, ACID transaction guarantees, and governance features of a data warehouse, so one platform can serve both BI/SQL analytics and data science/ML workloads.

### Why does it matter?

Organisations that built both a data warehouse and a data lake discovered a painful reality: they were maintaining two copies of the same data, connected by fragile ETL pipelines that frequently broke, drifted, or introduced inconsistencies. The BI team queried the warehouse; the data science team queried the lake; and when their numbers disagreed, nobody knew which was right. The lakehouse exists to collapse this two-system architecture into one. By adding a transaction and metadata layer (Delta Lake, Apache Iceberg, Apache Hudi — the open table formats, the layer that sits on top of raw lake files and adds ACID transactions, schema enforcement, and versioning), the lakehouse delivers warehouse-grade reliability on lake-scale economics. One copy of data, one governance model, one platform. [Source: M2 S5, slide 37]

### How it works in practice

1. **Open storage layer.** Data is stored in open columnar formats (Apache Parquet) on commodity cloud object storage (S3, ADLS, GCS). This is the same cheap, scalable storage used by data lakes. [Source: M2 S5, slide 37]
2. **Open table format.** A metadata layer — Delta Lake, Apache Iceberg, or Apache Hudi — sits on top of the Parquet files. This layer maintains a transaction log that records every change to the table (inserts, updates, deletes) as an ordered sequence of commits. [Source: M2 S5, slide 37]
3. **ACID transactions.** The transaction log enables atomic commits: a write either fully succeeds or fully rolls back. Concurrent readers and writers are isolated through optimistic concurrency control (each writer checks whether another writer's commit clashes with its own changes). This eliminates the data corruption risk of raw data lakes. [Source: M2 S5, slide 37]
4. **Schema enforcement and evolution.** Incoming data is validated against the table's schema (like a warehouse). But unlike a traditional warehouse, the schema can evolve — new columns can be added, column types can be widened — without rewriting existing data. [Source: M2 S5, slide 37]
5. **Time travel.** Because the transaction log retains the history of changes, users can query a table as it existed at any point in the past (`SELECT * FROM patients VERSION AS OF 42`). This supports audit trails, reproducible ML experiments, and easy rollbacks.
6. **Unified serving.** The same table serves both BI workloads (SQL queries from Tableau/Power BI via a SQL endpoint) and ML workloads (Spark/Pandas DataFrames for model training). No data duplication, no ETL pipeline between warehouse and lake. [Source: M2 S5, slide 37]
7. **Governance.** A unified catalogue (Databricks Unity Catalog, AWS Lake Formation) provides row/column-level access control, data lineage, and audit logging across all tables.

### Analogy

Imagine the data warehouse is a high-end restaurant with a fixed menu (schema-on-write). Every dish is polished and consistent, but you can only eat what the chef decided to serve. The data lake is a farmer's market — unlimited variety of raw ingredients (any data format) at low prices, but you have to wash, chop, and cook everything yourself, and there is no quality guarantee. The **lakehouse** is a modern food hall inside the farmer's market: same cheap ingredients, same variety, but now there are professional chefs (ACID transactions, schema enforcement) preparing dishes to restaurant standards right at the market stalls. You get the quality of the restaurant and the variety of the market in one location. The follow-through: the transaction log is the food-safety inspection certificate posted on each stall; time travel is the ability to taste last Tuesday's special; the unified catalogue is the food hall's directory board that tells you exactly which stall has which cuisine and its hygiene rating.

### Real-world example

[Source: M2 S5, slide 37]

A global bank previously maintained an Oracle-based data warehouse for regulatory reporting and a Hadoop-based data lake for fraud-detection ML models. The ETL pipeline between the two systems ran nightly and frequently failed, meaning the fraud models were trained on stale data. After migrating to a Databricks Lakehouse on Delta Lake, both workloads read from the same Delta tables on S3. Regulatory reports now reflect the same data the fraud models use, discrepancies disappeared, and the bank decommissioned $2 million per year in ETL infrastructure and Oracle licensing.

### Pros and cons

| Pros | Cons |
|------|------|
| **Cost.** Uses open formats on cheap object storage — 10x less than a dedicated warehouse | Query performance for complex BI may not yet match a fully tuned dedicated warehouse (e.g. Snowflake on structured-only data) |
| **Unified platform.** A single copy of data for BI and ML eliminates data duplication and ETL fragility | Ecosystem is still maturing — tooling, best practices, and talent are catching up |
| **ACID guarantees.** The transaction log ensures data consistency even with concurrent writers | Transaction overhead adds latency compared to raw lake writes |
| **Schema flexibility.** Schema enforcement on write plus graceful schema evolution | Requires expertise in open-source table formats (Delta, Iceberg, Hudi) |
| **Time travel.** Built-in versioning supports audit, rollback, and reproducible experiments | Retaining historical versions increases storage costs |
| **Governance.** Unified access control, lineage, and audit across all data | Governance features vary significantly across platforms and are evolving rapidly |

### Why it matters for managers

The lakehouse represents the current direction of the data platform industry. Databricks, Snowflake, Google, and AWS have all converged on lakehouse-style architectures, which means managers planning a new data platform in 2024 or beyond should default to evaluating lakehouse solutions. The key managerial benefit is simplification: instead of budgeting for a warehouse team, a lake team, and the ETL team that connects them, a lakehouse consolidates these into one platform and one team. Managers must also be realistic about maturity — mission-critical BI reporting that demands sub-second latency on complex joins may still warrant a dedicated warehouse layer, and the lakehouse can coexist alongside it.

### Exam-ready definition

> A lakehouse combines data lake storage (open formats on object stores) with data warehouse capabilities (ACID transactions, schema enforcement, SQL analytics) using open table formats like Delta Lake, Apache Iceberg, or Apache Hudi, serving both BI and ML workloads from a single platform.

---

## 6. Delta Lake & ACID Transactions on Data Lakes

### In short

Delta Lake is an open-source storage layer developed by Databricks that brings ACID transaction guarantees to data lakes by maintaining a transaction log over Apache Parquet files, enabling reliable reads and writes, schema enforcement, and time travel on commodity object storage.

### Why does it matter?

Apache Spark transformed data lake processing by making it possible to run SQL and ML at scale on files stored in S3 or HDFS. But Spark on raw Parquet files has a critical weakness: there are no transactions. If a Spark job writing to a Parquet directory fails halfway, the directory is left in a corrupt, partially-written state. If two jobs write to the same directory concurrently, they can overwrite each other's files. If a schema changes between writes, readers see inconsistent columns. Delta Lake exists to solve these problems by adding a thin transaction-log layer that makes data lake tables behave like database tables — atomic, consistent, isolated, and durable — without sacrificing the cost and flexibility benefits of lake storage. [Source: M2 S5, slide 37]

### How it works in practice

1. **Parquet files + transaction log.** A Delta table is a directory of Parquet data files plus a `_delta_log/` subdirectory containing an ordered sequence of JSON commit files (e.g. `000000.json`, `000001.json`, ...).
2. **Atomic writes.** When a Spark job writes new data, it first writes the new Parquet files to the directory, then atomically appends a new commit entry to the transaction log. If the job crashes before the commit entry is written, the new Parquet files are orphaned and invisible — readers never see partial writes. This is **Atomicity**.
3. **Schema validation.** Before committing, Delta Lake checks that the incoming data matches the table's schema. If a write attempts to add a column not in the schema (and strict mode is on), the write is rejected. This is **Consistency**.
4. **Optimistic concurrency control.** When two writers commit simultaneously, the transaction log uses optimistic concurrency: the second writer checks whether the first writer's commit conflicts with its own changes. If there is no conflict (e.g. they wrote to different partitions), both succeed. If there is a conflict, the second writer retries. This is **Isolation**.
5. **Durability.** Once a commit entry is written to the transaction log on durable object storage (S3, ADLS), it is permanent. Readers are guaranteed to see a consistent snapshot. This is **Durability**.
6. **Time travel.** The sequential commit log means Delta Lake can reconstruct the table's state at any historical commit version, enabling `SELECT * FROM table VERSION AS OF 10` or `DESCRIBE HISTORY table`.
7. **Compaction (OPTIMIZE).** Over time, many small Parquet files accumulate. Delta Lake's `OPTIMIZE` command merges them into larger files for better query performance, and `VACUUM` deletes orphaned files older than a retention threshold.

### Analogy

Think of a shared Google Doc with "Suggesting" mode turned off (raw data lake): if two people type in the same paragraph simultaneously, their edits overwrite each other, and there is no undo history. Now enable "Version History" and "Suggesting" mode (Delta Lake): every edit is recorded as a discrete change, two simultaneous editors see each other's cursors and changes are merged without conflict, and you can revert to any previous version of the document. The follow-through: the Version History panel is the `_delta_log/`; each named version is a commit entry; "Suggesting" mode is optimistic concurrency control; "Revert to this version" is time travel.

### Real-world example

[Source: M2 S5, slide 37]

A healthcare analytics company ingests patient lab results from 50 hospital systems every hour into a Delta Lake table on S3. Before Delta Lake, concurrent Spark jobs occasionally corrupted the Parquet directory, causing the downstream risk-prediction model to train on incomplete data — once flagging only 60% of high-risk patients because an entire hospital's data was silently lost in a failed write. After migrating to Delta Lake, every write is atomic: either all 50 hospitals' data commits or none does. The data science team now runs `SELECT * FROM lab_results VERSION AS OF '2024-01-15'` to reproduce the exact training dataset used for any model version — a critical requirement for regulatory audit trails under HIPAA.

### Pros and cons

| Pros | Cons |
|------|------|
| **Data reliability.** ACID transactions eliminate partial writes, silent corruption, and read/write conflicts | Transaction overhead adds 5–15% latency to write operations compared to raw Parquet |
| **Schema safety.** Schema enforcement catches data quality issues at write time | Strict mode can block legitimate schema evolution if not configured correctly |
| **Time travel.** Full version history enables audit, rollback, and reproducible experiments | Retaining all versions indefinitely increases storage cost; requires periodic VACUUM |
| **Performance.** OPTIMIZE compaction and Z-ordering improve query speed dramatically | Compaction is a separate job that must be scheduled and monitored |
| **Open format.** Based on Parquet — readable by any engine that supports Parquet | Delta-specific features (merge, time travel) require a Delta-aware engine (Spark, Trino with Delta connector) |
| **Ecosystem.** Strong integration with Databricks; growing support in open-source engines | Apache Iceberg and Hudi are competing standards — risk of format fragmentation |

### Why it matters for managers

Delta Lake (and its competitors Iceberg and Hudi) is the technology that made the lakehouse possible. For managers, the key insight is that ACID transactions on data lakes are no longer a "nice to have" — they are table stakes for any production data platform. Without them, every report and every ML model is built on data that might be silently incomplete or corrupt. The cost of adding Delta Lake is near zero (it is open-source and uses the same storage), while the cost of not having it is measured in bad decisions made on bad data. Managers evaluating data platform vendors should confirm that the platform supports an open table format with ACID guarantees.

### Exam-ready definition

> Delta Lake is an open-source storage layer that adds ACID transactions, schema enforcement, and time travel to data lakes by maintaining a transaction log over Parquet files, enabling reliable, concurrent reads and writes on object storage.

---

## 7. Schema-on-Write vs Schema-on-Read

### In short

Schema-on-write is a data management approach where data must conform to a predefined schema before it is stored (as in a data warehouse); schema-on-read is the opposite approach, where data is stored in its raw format and structure is applied only at the time of querying (as in a data lake). This single design decision explains most of the differences between warehouses, lakes, and lakehouses.

### Why does it matter?

Every data platform must answer one fundamental question: *when do you commit to a structure?* The answer determines the entire downstream experience — data quality, query performance, flexibility, and governance. Schema-on-write emerged from the relational database tradition where consistency is paramount: banks, regulators, and finance teams need every number to mean the same thing every time. Schema-on-read emerged from the big data era where the volume, velocity, and variety of incoming data made upfront schema design impractical — by the time you finished modelling the schema for IoT sensor data, three new sensor types had been deployed. Neither approach is inherently superior; each trades one virtue for another. Understanding this trade-off is the single most important conceptual foundation for choosing between warehouse, lake, and lakehouse architectures. [Source: M2 S5, slide 40]

### How it works in practice

**Schema-on-write (warehouse approach):**

1. **Design the schema first.** Data engineers define tables, columns, data types, constraints, and relationships before any data is loaded.
2. **Validate on ingestion.** Every incoming record is checked against the schema during the ETL process. Records that do not conform are rejected or quarantined.
3. **Store structured data.** Only validated, schema-compliant data enters the warehouse. This guarantees that every consumer sees consistent structure.
4. **Query with confidence.** Because every row has been pre-validated, SQL queries return predictable, trustworthy results without additional data-cleaning logic.

**Schema-on-read (lake approach):**

1. **Store first, ask questions later.** Data arrives in its native format (CSV, JSON, images, logs, video) and is written directly to the storage layer with no transformation.
2. **No upfront modelling delay.** New data sources can be ingested in minutes rather than the weeks required to design and implement a warehouse schema.
3. **Apply structure at query time.** When an analyst or data scientist reads the data, they impose a schema at that moment — casting types, filtering nulls, interpreting columns. Different users can read the same raw data with different schemas for different purposes.
4. **Quality problems surface late.** Because no validation happened on write, issues like missing fields, type mismatches, and duplicate records are discovered only when someone queries the data — often during a critical analysis.

**Lakehouse hybrid:**

The lakehouse takes the schema-on-read storage model (cheap, flexible, any format) and adds schema-on-write enforcement at the table layer. Data is stored in open formats on object storage (like a lake), but the open table format (Delta Lake, Iceberg) validates incoming data against a defined schema before committing the write (like a warehouse). The result is warehouse-grade trust on lake-grade economics. [Source: M2 S5, slide 40]

### Analogy

Schema-on-write is like a strict university admissions process: every applicant must submit transcripts, test scores, and references in a specified format, and only those who meet all criteria are admitted. Once enrolled, every student's record is consistent and immediately usable. Schema-on-read is like an open-access community library: anyone can donate any book in any condition, and the library shelves everything. When a researcher visits, they must inspect each book themselves to determine whether it is relevant, accurate, and complete. The follow-through: the warehouse (university) rejects non-conforming data at the door — you lose flexibility but gain trust; the lake (community library) accepts everything — you gain volume but must invest effort at read time to separate the valuable from the junk. The lakehouse is a community library that hired a part-time admissions officer: donations are still welcome in any format, but each one is catalogued and quality-checked before it earns a shelf position.

### Real-world example

[Source: M2 S5, slide 40]

A financial services firm operates both a data warehouse and a data lake. The warehouse (schema-on-write) holds regulatory reporting data — every trade, every position, every margin calculation — with strict schema enforcement. When the regulator asks for a specific report, the compliance team runs a SQL query and gets a trusted answer in seconds. The data lake (schema-on-read) holds research data — news feeds, social media sentiment, analyst reports in PDF format, earnings call transcripts — that the quantitative research team uses for experimental trading signals. The quant team does not know in advance which fields they will need, so imposing a schema upfront would be premature. The trade-off is explicit: the compliance team gets trust at the cost of rigidity; the research team gets flexibility at the cost of cleaning effort every time they query.

### Schema-on-write vs. schema-on-read

Left column: schema-on-write (the warehouse way). Right column: schema-on-read (the lake way). Read each row as the trade-off between the two.

| Aspect | Schema-on-Write | Schema-on-Read |
|---|---|---|
| Data quality | Bad records rejected at the door — high trust | Quality problems surface late, at query time |
| Flexibility | Slow to accommodate new data types; schema changes require migration | Anything can be captured immediately; no upfront modelling delay |
| Consistency | Every consumer sees identical structure | Different teams may read the same data differently |
| Query performance | Predictable — optimiser knows the schema | Variable — depends on how the reader imposes structure |
| Cost of storage | Higher (structured, indexed, columnar) | Lower (raw files on object storage) |
| Audit and lineage | Straightforward — schema is the contract | Trust must be added back manually through governance |
| Time to value | Slower (design schema → build ETL → load → query) | Faster (ingest → query with ad-hoc schema) |
| Reusability | Same raw data supports only the predefined schema | Same raw data supports many interpretations |

### Why it matters for managers

This is the most important conceptual distinction in this module. Every vendor pitch, every architecture debate, and every platform-selection decision ultimately comes back to when structure is imposed. A manager who understands this trade-off can cut through marketing jargon: when Snowflake emphasises governance and consistency, they are selling schema-on-write strengths; when Databricks emphasises flexibility and ML support, they are selling schema-on-read strengths; when either vendor says "lakehouse", they are claiming to offer both. The manager's job is to match the approach to the workload: regulated reporting demands schema-on-write; exploratory data science benefits from schema-on-read; a modern platform that must serve both needs a lakehouse that combines the two. [Source: M2 S5, slide 40]

### Exam-ready definition

> Schema-on-write validates and structures data before storage (warehouse approach), ensuring consistency at the cost of flexibility; schema-on-read stores raw data and applies structure at query time (lake approach), ensuring flexibility at the cost of upfront trust — the lakehouse combines both by enforcing schema at the table layer over flexible lake storage.

---

## 8. Business Problem #4 — Healthcare Patient Readmission

### In short

Hospital patient readmission is the event of a patient being admitted to a hospital within 30 days of a previous discharge, which CMS (Centers for Medicare & Medicaid Services) tracks as a quality metric and penalises financially when rates exceed national benchmarks.

### Why does it matter?

Excessive 30-day readmissions are a symptom of systemic healthcare delivery failures: premature discharge, inadequate follow-up care, poor medication reconciliation, and unaddressed social determinants (the patient was discharged to unstable housing, lacked transportation to follow-up appointments, or could not afford prescribed medications). CMS imposes financial penalties on hospitals with readmission rates above the national average — penalties that can reach millions of dollars annually for large hospital networks. Beyond the financial impact, each readmission represents a patient who suffered a preventable deterioration in health. This makes readmission prediction a high-value use case for big data analytics. [Source: M2 S5, slide 38]

### How it works in practice

1. **Data collection.** The hospital network aggregates data from multiple sources into a lakehouse:
   - **Structured:** Electronic Health Records (EHR) — diagnoses (ICD-10 codes), medications, lab results, vital signs, admission/discharge dates. [Source: M2 S5, slide 38]
   - **Structured:** Claims and billing data — procedure codes (CPT), payer information, length of stay, cost.
   - **Semi-structured:** Physician notes and discharge summaries — free-text clinical documents parsed using Natural Language Processing (NLP — turning free text into data a computer can use). [Source: M2 S5, slide 38]
   - **External/Unstructured:** Social Determinants of Health (SDOH — the non-medical factors such as income, housing, transport, and food access that shape health) data — zip-code-level income, housing stability, transportation access, food insecurity indices. [Source: M2 S5, slide 38]
2. **Architecture choice: Lakehouse.** A lakehouse is selected because the data spans structured tables (EHR, claims) and unstructured text (physician notes). The raw zone ingests EHR exports, claims files, and NLP-processed notes. The curated zone feeds a feature store. [Source: M2 S5, slide 38]
3. **Feature engineering.** Data scientists build predictive features: number of prior admissions in 12 months, count of active medications, presence of specific comorbidities (diabetes, heart failure), days since last lab test, NLP-extracted sentiment from discharge notes ("patient expressed concern about medication cost"), zip-code SDOH risk score.
4. **Model training.** An ML pipeline (XGBoost — a gradient-boosted tree algorithm, one of the most common ML models — or a deep learning model) is trained on historical admissions, with the target variable being "readmitted within 30 days: yes/no". The model is evaluated using AUC-ROC, precision, and recall, with particular attention to recall (catching as many true readmissions as possible). [Source: M2 S5, slide 38]
5. **Real-time scoring.** At the point of discharge, the model scores each patient's readmission risk. High-risk patients (e.g. top 20% predicted probability) are flagged in the clinical workflow system.
6. **Intervention.** Flagged patients receive enhanced discharge planning: follow-up phone calls within 48 hours, home health nurse visits, medication reconciliation consultations, and referrals to community support services (transportation, food assistance). [Source: M2 S5, slide 38]
7. **Outcome measurement.** The hospital tracks 30-day readmission rates before and after deployment, stratified by risk tier, to validate the model's impact and refine the intervention protocols.

### Analogy

Imagine a school that notices students who fail a course frequently drop out within one semester. Instead of waiting for the dropout to happen, the school builds an "early warning system" that scores each student at mid-term based on attendance, grades, participation, and personal circumstances (long commute, part-time job). Students in the top risk tier receive proactive interventions: tutoring, counselling, schedule adjustments. The follow-through: EHR data is the student's grade record; SDOH data is the personal circumstances; the ML model is the early-warning scoring algorithm; the enhanced discharge plan is the tutoring intervention; and the CMS penalty is the school's accreditation review that punishes high dropout rates.

### Real-world example

[Source: M2 S5, slide 38]

A 12-hospital network in the southeastern United States had a 30-day readmission rate of 18.4 %, well above the CMS national benchmark of 15.5 %. Using a Databricks Lakehouse, the analytics team integrated EHR data, claims, NLP-processed physician notes, and zip-code-level SDOH data into a unified feature store. An XGBoost model achieved 0.78 AUC-ROC in identifying high-risk patients. After deploying the model into the clinical workflow and launching a nurse-led follow-up programme for the top-risk quintile, the readmission rate dropped to 14.9 % within 12 months — avoiding an estimated $3.2 million in CMS penalties and, more importantly, preventing approximately 1,100 unnecessary readmissions that year.

### Pros and cons

| Pros | Cons |
|------|------|
| **Financial impact.** Directly reduces CMS readmission penalties (millions per year for large networks) | Model development and clinical workflow integration require significant upfront investment |
| **Patient outcomes.** Proactive intervention prevents suffering and complications from preventable readmissions | Predictions are probabilistic — some high-risk patients will be missed (false negatives) |
| **Data integration.** Lakehouse unifies structured EHR, semi-structured notes, and external SDOH data on one platform | Physician notes require NLP preprocessing, which introduces noise and interpretation errors |
| **Scalability.** Model can score every discharge in real time across all hospitals | Clinical staff must trust and act on model recommendations — adoption is a change-management challenge |
| **Regulatory value.** Demonstrates data-driven quality improvement for CMS and accreditation bodies | HIPAA compliance adds complexity to data storage, access, and model deployment |

### Why it matters for managers

This business problem illustrates why the lakehouse architecture is not an abstract technical concept — it directly enables a use case that saves millions of dollars and improves patient lives. A manager evaluating data platform investments should use cases like this to build the ROI justification: the cost of a lakehouse platform (Databricks licensing, data engineering headcount, clinical integration) is dwarfed by the CMS penalties avoided and the operational costs of unnecessary readmissions ($15,000–$25,000 per readmission). The manager's role is to champion the cross-functional collaboration required — data engineering, data science, clinical operations, and compliance must all work together, and that coordination is a leadership function, not a technical one.

### Exam-ready definition

> Healthcare patient readmission prediction uses a lakehouse architecture to integrate structured EHR data, semi-structured physician notes, and external SDOH data, training ML models to identify high-risk patients at discharge and trigger proactive interventions that reduce 30-day readmission rates and CMS financial penalties.

---

## 9. Decision Framework — Warehouse vs Lake vs Lakehouse

[Source: M2 S5, slide 39]

This section does not follow the standard eight-part template because it pulls the earlier concepts together into a practical decision guide.

### When to Choose a Data Warehouse

- Your data is **predominantly structured** (relational tables, CSV exports, ERP/CRM data).
- Your primary workload is **BI dashboards and SQL reporting** with well-defined, repeatable queries.
- You need **strict schema enforcement** and fast, predictable query performance.
- **Regulatory compliance** demands rigorous data quality controls and audit trails.
- You have a mature BI team that thinks in SQL and uses tools like Tableau, Power BI, or Looker.

*Recommended platforms: Snowflake, Amazon Redshift, Google BigQuery.* [Source: M2 S5, slide 39]

### When to Choose a Data Lake

- You need to store **massive volumes of raw, diverse data types** (logs, images, video, IoT streams, free text) at low cost.
- Your primary workloads are **data science, ML model training, or exploratory analysis** where schema requirements are fluid.
- Schema requirements are **not yet defined** — you are collecting data now to analyse later.
- You have **governance processes in place** to prevent the lake from becoming a data swamp.
- You have data engineers and data scientists comfortable with Spark, Python, and schema-on-read workflows.

*Recommended platforms: Amazon S3 + AWS Glue, Azure Data Lake Storage, Google Cloud Storage + Dataproc.* [Source: M2 S5, slide 39]

### When to Choose a Lakehouse

- You need a **single platform for both BI and ML** workloads.
- You want **warehouse-like governance** (ACID transactions, schema enforcement) on **lake-scale, low-cost storage**.
- You are building a **modern data platform** and want to avoid maintaining separate warehouse and lake systems with fragile ETL between them.
- Your data includes a **mix of structured and unstructured types**.
- You want **time travel, versioning, and reproducibility** for ML experiments and regulatory audits.

*Recommended platforms: Databricks Lakehouse (Delta Lake), Snowflake (Iceberg support), Google BigLake, AWS Lake Formation + Athena.* [Source: M2 S5, slide 39]

### Decision Matrix

| Decision Criterion | Data Warehouse | Data Lake | Lakehouse |
|---|---|---|---|
| Data types | Structured only | All types (structured, semi-, unstructured) | All types |
| Schema enforcement | Schema-on-write (strict) | Schema-on-read (flexible) | Schema-on-write with evolution |
| ACID transactions | Yes (built-in) | No (without Delta/Iceberg) | Yes (via open table format) |
| Primary workload | BI / SQL reporting | ML / exploration / raw storage | BI + ML unified |
| Storage cost | High ($5–$23 / TB / month) | Low ($0.02–$0.03 / GB / month) | Low (same as lake) |
| Query performance (BI) | Excellent | Poor without optimisation | Good, improving rapidly |
| ML support | Limited (structured features only) | Excellent (raw data access) | Excellent |
| Governance | Mature | Opt-in, often weak | Unified, improving |
| Vendor lock-in risk | Moderate–high | Low (open storage) | Low (open table formats) |
| Best for | Regulated reporting, executive dashboards | Data science, raw archival | Modern unified platforms |

### Hybrid Reality

[Source: M2 S5, slide 39]

In practice, many enterprises adopt a **hybrid approach**: a dedicated warehouse for mission-critical BI reporting (where sub-second latency on complex joins is non-negotiable) alongside a lakehouse for broader analytics, ML, and data science. The key insight for exam answers is that these architectures are not mutually exclusive — they exist on a spectrum, and the lakehouse is converging toward the centre.

---

## 10. The Cost & Governance Lens

### In short

The cost and governance lens is a managerial evaluation framework that assesses data platform choices across seven cost lines (storage, compute, egress, licensing, migration, people/skills, and exit cost — what it would cost to leave the platform later) and a non-negotiable governance floor set by regulatory requirements, so platform selection is driven by total cost of ownership and compliance reality rather than headline storage prices.

### Why does it matter?

Vendor conversations almost always start with storage cost — the smallest line item. Managers who evaluate platforms on storage price alone miss the six other cost lines that typically dwarf it: compute (the real driver of surprise bills), egress and transfer fees (invisible until the first cross-region bill), licensing (per-user or per-credit), migration (one-off, always underestimated), people and skills (ongoing — the platform your team cannot operate is the most expensive option available), and exit cost (what it takes to leave, which must be asked before signing, never after). Beyond cost, regulation sets a governance floor that no cost saving can override: if personal, health, or financial data is in scope, access control, retention limits, lineage, and deletion capability are entry requirements, not optional add-ons. [Source: M2 S5, slide 42]

### How it works in practice

1. **Enumerate all seven cost lines.** For each candidate platform, estimate: storage, compute, egress/transfer, licensing, migration, people/skills, and exit cost. Do not stop at the vendor's headline pricing page. [Source: M2 S5, slide 42]
2. **Identify the governance floor.** Determine whether the data in scope includes personal data (GDPR/CCPA), health data (HIPAA), or financial data (SOX, PCI-DSS). If so, access control, retention limits, lineage tracking, and deletion capability are mandatory — not negotiable features.
3. **Apply the six-step platform selection process.** [Source: M2 S5, slide 41]
   - **Step 1 — Classify the workloads.** What share is BI reporting, ad-hoc SQL, machine learning, streaming?
   - **Step 2 — Classify the data.** What proportion is structured today — and what will it be in three years?
   - **Step 3 — Fix the governance floor.** Regulated, audited, or personal data sets a minimum, not a preference.
   - **Step 4 — Set the latency requirement.** Per decision: monthly close, daily plan, or sub-minute alert?
   - **Step 5 — Model total cost honestly.** Storage plus compute plus egress plus migration plus the skills to run it.
   - **Step 6 — Record the decision-reversing assumption.** Write down the one fact that, if false, would change this choice.
4. **Assess vendor lock-in.** Open storage formats (Parquet, ORC) keep the exit door open; proprietary formats and deeply embedded compute close it. This is a board-level question because it determines negotiating position at every future renewal. [Source: M2 S5, slide 42]
5. **Apply the rule of thumb.** Mostly structured and heavily regulated leans warehouse; mostly unstructured and exploratory leans lake; genuinely both, on one governed copy, leans lakehouse. [Source: M2 S5, slide 41]

### Analogy

Choosing a data platform is like choosing a commercial kitchen lease. The landlord quotes rent per square foot (storage cost), but the real expense is the equipment you must install (compute), the utility bills for gas and water (egress), the health inspector's requirements (governance floor), the cost of moving your staff and recipes from the old kitchen (migration), training your chefs on unfamiliar equipment (people/skills), and the early termination penalty if you want to leave (exit cost). A manager who signs a lease based only on rent per square foot will be surprised by every subsequent bill. The follow-through: the governance floor is the health inspector — no amount of savings on rent overrides the requirement to have a functioning refrigerator if you serve meat.

### Real-world example

[Source: M2 S5, slide 42]

A hospital network evaluating lakehouse platforms received three proposals. Vendor A quoted the lowest storage cost ($0.02/GB/month). Vendor B was 3x more expensive on storage but offered a fully managed compute tier with auto-scaling. Vendor C offered open-source Delta Lake on S3 with the lowest total cost — but required hiring two additional data engineers. When the CTO modelled all seven cost lines over three years, Vendor B was cheapest (lower compute costs offset higher storage), Vendor A had hidden egress fees that doubled the year-two bill, and Vendor C's people cost ($300K/year for two engineers) exceeded Vendor B's entire platform fee. The governance floor eliminated Vendor A entirely: it lacked the row-level access control required for HIPAA compliance. The lesson: headline storage price is the beginning of the conversation, not the answer.

### Pros and cons

| Pros | Cons |
|------|------|
| **Total cost visibility.** Seven-line cost model prevents surprise bills and vendor lock-in | Requires honest estimation of skills and migration costs, which are hard to quantify upfront |
| **Governance floor.** Ensures regulatory compliance is treated as non-negotiable, not a feature to evaluate | Governance requirements may eliminate otherwise attractive low-cost options |
| **Six-step process.** Provides a structured, repeatable decision framework for platform selection | Adds upfront analysis time that stakeholders may resist when under pressure to "just pick one" |
| **Exit cost awareness.** Forces organisations to assess lock-in before signing, not after | Exit cost is speculative until you actually try to leave — estimates may be inaccurate |
| **Decision-reversing assumption.** Documents the conditions under which the decision should be revisited | Requires intellectual honesty that organisational politics may discourage |

### Why it matters for managers

This framework is the bridge between technical architecture and executive decision-making. A CTO who presents a platform recommendation without addressing all seven cost lines and the governance floor will face uncomfortable questions from the CFO and General Counsel. The six-step process gives managers a defensible, structured approach that they can present to a board: here is the workload mix, here is the data classification, here is the governance minimum, here is the three-year total cost model, and here is the assumption that would change our mind. Step 6 — recording the decision-reversing assumption — is particularly valuable because it transforms a one-time decision into a monitored position that can be revisited when conditions change. [Source: M2 S5, slides 41–42]

### Exam-ready definition

> The cost and governance lens evaluates data platform choices across seven cost lines (storage, compute, egress, licensing, migration, people/skills, exit cost) and a regulatory governance floor, using a six-step selection process that matches workload mix, data classification, latency needs, and total cost to the right architecture.

---

## 11. Visual Aids

### Visual 1: Data Lake Zone Architecture
[Source: M2 S5, slide 36]

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAKE                                │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │   RAW /      │    │  CLEANSED    │    │   CURATED /      │   │
│  │   LANDING    │───▶│  ZONE        │───▶│   CONSUMPTION    │   │
│  │   ZONE       │    │              │    │   ZONE           │   │
│  │              │    │              │    │                  │   │
│  │ • CSV, JSON  │    │ • Validated  │    │ • Business-ready │   │
│  │ • Images     │    │ • Deduped    │    │ • Parquet tables │   │
│  │ • Logs       │    │ • Type-cast  │    │ • Feature stores │   │
│  │ • Video      │    │ • Standardised│   │ • Aggregated     │   │
│  │ • Free text  │    │              │    │   views          │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              STORAGE LAYER                                  │ │
│  │  HDFS (on-premise)  |  S3  |  ADLS  |  GCS  (cloud)       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              PROCESSING ENGINES                             │ │
│  │  Apache Spark  |  Presto / Trino  |  Apache Hive           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              METADATA CATALOGUE                             │ │
│  │  Glue Catalog  |  Hive Metastore  |  Unity Catalog         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

Data lake architecture: the three-zone data flow (Raw → Cleansed → Curated) sits on top of the storage, processing, and catalogue layers. [Source: M2 S5, slide 36]

**Exam tip:** When asked to draw or describe a data lake architecture, always include all three zones and the metadata catalogue — omitting governance (the catalogue) is a common mark-losing mistake.

---

### Visual 2: Star Schema vs Snowflake Schema
[Source: M2 S5, slide 35]

```
         STAR SCHEMA                          SNOWFLAKE SCHEMA

     ┌──────────────┐                      ┌──────────────┐
     │ dim_customer  │                      │ dim_customer  │
     │──────────────│                      │──────────────│
     │ customer_id  │                      │ customer_id  │
     │ name         │                      │ name         │
     │ region       │                      │ region_id  ──│──┐
     │ segment      │                      │ segment_id ──│──│──┐
     └──────┬───────┘                      └──────┬───────┘  │  │
            │                                     │          │  │
            │                                     │    ┌─────┴──────┐
 ┌──────────┤                           ┌─────────┤    │ dim_region  │
 │          │                           │         │    │────────────│
 │   ┌──────┴──────────┐                │  ┌──────┴─── │ region_id  │
 │   │   FACT_SALES    │                │  │           │ region_name│
 │   │────────────────│                │  │           └────────────┘
 │   │ date_key    (FK)│                │  │     ┌────────────┐
 │   │ product_key (FK)│                │  │     │ dim_segment│
 │   │ customer_key(FK)│                │  │     │───────────│
 │   │ store_key   (FK)│                │  │     │ segment_id │
 │   │                │                │  │     │ segment_nm │
 │   │ sales_amount   │                │  │     └────────────┘
 │   │ quantity        │                │  │
 │   │ discount        │                │  │   ┌──────────────────┐
 │   └──┬──────┬───────┘                │  │   │   FACT_SALES     │
 │      │      │                        │  │   │────────────────-│
 │      │      │                        │  │   │ Same as star     │
 │ ┌────┴───┐ ┌┴───────────┐            │  │   └──┬───────┬──────┘
 │ │dim_date│ │dim_product  │            │  │      │       │
 │ │────────│ │────────────│            │  │ ┌────┴───┐  ┌┴──────────┐
 │ │date_key│ │product_id  │            │  │ │dim_date│  │dim_product │
 │ │day     │ │product_name│            │  │ └────────┘  │───────────│
 │ │month   │ │category    │            │  │             │product_id │
 │ │quarter │ │subcategory │            │  │             │product_nm │
 │ │fiscal_y│ │brand       │            │  │             │category_id│──▶ dim_category
 │ └────────┘ └────────────┘            │  │             └───────────┘
 │                                      │  │
 └──dim_store (denormalised)            └──└──dim_store (normalised)
```

Star schema (left) uses denormalised dimension tables, which means fewer joins and faster queries. Snowflake schema (right) normalises dimensions into sub-tables, which reduces redundancy but adds join complexity. [Source: M2 S5, slide 35]

**Exam tip:** If asked to compare star and snowflake schemas, draw both side by side and highlight the trade-off: star = fewer joins = faster queries; snowflake = normalised dimensions = less storage redundancy.

---

### Visual 3: Lakehouse Architecture Layers
[Source: M2 S5, slide 37]

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONSUMERS                                    │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  BI / SQL    │  │  Data Science │  │  Streaming Analytics  │  │
│  │  (Tableau,   │  │  (Notebooks,  │  │  (Real-time           │  │
│  │   Power BI,  │  │   Spark ML,   │  │   dashboards,         │  │
│  │   Looker)    │  │   PyTorch)    │  │   alerting)           │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬────────────┘  │
│         │                 │                      │               │
│         └─────────────────┼──────────────────────┘               │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │             UNIFIED GOVERNANCE LAYER                        │ │
│  │  Access control  |  Data lineage  |  Audit logging          │ │
│  │  (Unity Catalog, Lake Formation, Polaris)                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          OPEN TABLE FORMAT (Transaction Layer)              │ │
│  │                                                             │ │
│  │  Delta Lake  |  Apache Iceberg  |  Apache Hudi              │ │
│  │                                                             │ │
│  │  • ACID transactions    • Schema enforcement & evolution    │ │
│  │  • Time travel          • Optimistic concurrency control    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          OPEN FILE FORMAT (Data Layer)                      │ │
│  │  Apache Parquet  |  ORC  |  Avro  |  JSON  |  Raw files    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          CLOUD OBJECT STORAGE                               │ │
│  │  Amazon S3  |  Azure Data Lake Storage  |  Google GCS      │ │
│  │  (Virtually unlimited, $0.02–$0.03 / GB / month)           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

Lakehouse architecture in four layers: cloud object storage → open file formats → open table format (ACID and governance) → unified consumer access for BI and ML. [Source: M2 S5, slide 37]

**Exam tip:** When drawing a lakehouse architecture, always show the open table format layer (Delta Lake/Iceberg/Hudi) as a distinct layer between storage and consumers — this is the layer that separates a lakehouse from a raw data lake.

---

### Visual 4: Healthcare Readmission Lakehouse Pipeline
[Source: M2 S5, slide 38]

```
    DATA SOURCES                   LAKEHOUSE                        ACTION

┌──────────────┐         ┌─────────────────────────┐
│  EHR Systems  │────────▶│                         │
│ (diagnoses,   │         │      RAW ZONE           │
│  medications, │         │  (EHR exports, claims,  │
│  vitals)      │         │   NLP-parsed notes,     │
└──────────────┘         │   SDOH files)           │
                         │                         │
┌──────────────┐         │          │               │
│ Claims Data   │────────▶│          ▼               │
│ (CPT codes,   │         │                         │
│  payer info)  │         │    CURATED ZONE          │        ┌──────────────┐
└──────────────┘         │  (Feature store:         │        │  Clinical    │
                         │   comorbidity counts,   │──ML──▶│  Workflow    │
┌──────────────┐         │   med counts, SDOH      │ Model  │  System      │
│ Physician     │────────▶│   risk scores,          │        │              │
│ Notes (NLP)   │         │   NLP features)         │        │  ▶ Flag high │
└──────────────┘         │                         │        │    risk      │
                         │          │               │        │  ▶ Schedule  │
┌──────────────┐         │          ▼               │        │    follow-up │
│ SDOH Data     │────────▶│                         │        │  ▶ Nurse     │
│ (zip-code     │         │   ML TRAINING            │        │    visit     │
│  income,      │         │  (XGBoost, 0.78 AUC)   │        └──────────────┘
│  housing)     │         │                         │
└──────────────┘         └─────────────────────────┘
```

End-to-end healthcare readmission pipeline: data sources flow into a lakehouse (raw → curated → ML training), and the model scores patients at discharge to trigger a clinical intervention. [Source: M2 S5, slide 38]

**Exam tip:** This diagram is ideal for case-based 10-mark questions on Business Problem #4 — draw the data sources, the lakehouse zones, the ML model, and the clinical intervention loop.

---

### Visual 5: Schema-on-Write vs Schema-on-Read vs Lakehouse Hybrid
[Source: M2 S5, slide 40]

```
  SCHEMA-ON-WRITE (Warehouse)         SCHEMA-ON-READ (Lake)           LAKEHOUSE HYBRID

  ┌──────────────┐                    ┌──────────────┐                ┌──────────────┐
  │  Raw Data     │                    │  Raw Data     │                │  Raw Data     │
  │  (CSV, JSON,  │                    │  (CSV, JSON,  │                │  (CSV, JSON,  │
  │   API feeds)  │                    │   images,     │                │   images,     │
  └──────┬───────┘                    │   video, logs)│                │   video, logs)│
         │                            └──────┬───────┘                └──────┬───────┘
         ▼                                   │                               │
  ┌──────────────┐                           │                               ▼
  │  ETL PROCESS  │                           │                        ┌──────────────┐
  │  • Validate   │                           │                        │  OPEN TABLE   │
  │  • Clean      │                           │                        │  FORMAT       │
  │  • Type-cast  │                           │                        │  (Delta/      │
  │  • Conform    │                           │                        │   Iceberg)    │
  │  to schema    │                           │                        │              │
  └──────┬───────┘                           │                        │ • Schema     │
         │                                   │                        │   enforced   │
         │  ✗ Reject if                      │                        │   on write   │
         │    non-conforming                 │                        │ • ACID txns  │
         ▼                                   ▼                        │ • Time travel│
  ┌──────────────┐                    ┌──────────────┐                └──────┬───────┘
  │  WAREHOUSE    │                    │  LAKE STORAGE │                      │
  │  (structured, │                    │  (raw, any    │                      ▼
  │   columnar)   │                    │   format)     │                ┌──────────────┐
  └──────┬───────┘                    └──────┬───────┘                │  LAKE STORAGE │
         │                                   │                        │  (Parquet on  │
         ▼                                   ▼                        │   S3/ADLS)    │
  ┌──────────────┐                    ┌──────────────┐                └──────┬───────┘
  │  QUERY TIME   │                    │  QUERY TIME   │                      │
  │  Schema:      │                    │  Schema:      │                      ▼
  │  ALREADY      │                    │  APPLIED NOW  │                ┌──────────────┐
  │  APPLIED ✓    │                    │  by the reader│                │  QUERY TIME   │
  └──────────────┘                    └──────────────┘                │  Schema:      │
                                                                      │  ALREADY      │
  Trust: HIGH                         Trust: LOW                      │  APPLIED ✓    │
  Flexibility: LOW                    Flexibility: HIGH               └──────────────┘
  Cost: HIGH                          Cost: LOW
                                                                      Trust: HIGH
                                                                      Flexibility: HIGH
                                                                      Cost: LOW
```

Three schema strategies side by side. Schema-on-write (left) validates before storing; schema-on-read (centre) stores raw and validates at query time; the lakehouse hybrid (right) stores in open formats but enforces schema through the table format layer. [Source: M2 S5, slide 40]

**Exam tip:** When asked to explain the fundamental difference between warehouses, lakes, and lakehouses, this one diagram captures the core trade-off. Draw the three columns and label the trust/flexibility/cost trade-offs at the bottom.

---

## 12. Session Summary

| Concept | Key Principle | Technology Examples | Exam Keyword |
|---|---|---|---|
| Cloud Computing | On-demand IT resources, pay-as-you-go | AWS, Azure, GCP; IaaS/PaaS/SaaS | Elastic scaling, OpEx |
| Data Warehouse | Structured, schema-on-write, optimised for BI | Redshift, BigQuery, Snowflake, Teradata | Schema-on-write, star schema |
| Star & Snowflake Schema | Fact + dimension table design for analytics | All warehouses | Denormalised (star) vs normalised (snowflake) |
| Data Lake | Raw data, any format, schema-on-read, low cost | S3, ADLS, GCS, HDFS | Schema-on-read, data swamp risk |
| Lakehouse | Lake storage + warehouse governance, unified BI+ML | Databricks, Delta Lake, Iceberg, Hudi | ACID on object storage, open table format |
| Delta Lake | ACID transactions on Parquet files via transaction log | Databricks Delta Lake, Iceberg, Hudi | Transaction log, time travel |
| Schema-on-Write vs Read | When structure is imposed determines the entire platform experience | All three platforms | Schema-on-write = trust; schema-on-read = flexibility |
| Business Problem #4 | Predict readmission to reduce CMS penalties | Lakehouse + XGBoost + NLP | EHR + SDOH, 30-day readmission |
| Cost & Governance Lens | Seven cost lines + governance floor; storage is the smallest line | All platforms | Total cost of ownership, exit cost, governance floor |

---

## 13. Key Takeaways

1. **Cloud computing democratised big data.** Pay-as-you-go pricing and managed services mean data platform capability is no longer gated by capital expenditure — any organisation can access petabyte-scale analytics.

2. **Data warehouses are not obsolete.** They remain the gold standard for structured BI reporting where schema enforcement, data quality, and fast SQL performance are non-negotiable.

3. **Data lakes solve the diversity problem.** When your data includes images, logs, video, and free text, a warehouse cannot accommodate it — a data lake stores everything in native format at 10–100x lower cost.

4. **Data lakes without governance become data swamps.** The most common failure mode of data lake initiatives is not enough money spent on metadata catalogues, access controls, and data quality monitoring.

5. **The lakehouse is a convergence, not a replacement.** It does not eliminate warehouses or lakes; it combines their strengths (warehouse governance + lake flexibility) using open table formats that add ACID transactions to object storage.

6. **Delta Lake, Iceberg, and Hudi are the enabling technologies.** They add the transaction log that turns a directory of Parquet files into a reliable, versioned, ACID-compliant table. Know at least one by name for the exam.

7. **Business Problem #4 demonstrates the lakehouse value proposition.** Healthcare readmission prediction requires structured clinical data, semi-structured physician notes, and external SDOH data — only a lakehouse can unify these on one platform with the governance required for HIPAA compliance.

8. **The right architecture depends on the workload.** Warehouse for structured BI, lake for ML on diverse data, lakehouse for unified platforms. Most enterprises will adopt a hybrid approach.

9. **Schema-on-write vs schema-on-read is the single most important design decision.** It determines data quality, query performance, flexibility, and governance. Every warehouse-vs-lake-vs-lakehouse debate reduces to this choice. [Source: M2 S5, slide 40]

10. **Storage is rarely the deciding cost.** Compute, migration, people/skills, and exit cost usually dwarf storage. Evaluate all seven cost lines before selecting a platform. [Source: M2 S5, slide 42]

11. **Record the decision-reversing assumption.** Write down the one fact that, if false, would change the platform choice. This transforms a one-time decision into a monitored position. [Source: M2 S5, slide 41]

---
