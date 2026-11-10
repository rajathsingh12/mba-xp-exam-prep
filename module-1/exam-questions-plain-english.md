# Module 1 — Exam Questions (Plain English)

## 10-Mark Questions

### Q1. Explain the 5 Vs of Big Data with a business example for each V. Why is Value the most important V?
[Source: M1 S2, slides 15–20]

**Model Answer** (800–1000 words)

The 5 Vs of Big Data — Volume, Velocity, Variety, Veracity, and Value — are a checklist executives use to figure out whether a business situation genuinely involves big data and what kind of tools and investment it needs. The first four Vs describe the data itself; the fifth V is the business outcome that makes the other four worth paying for.

**Volume** is the sheer amount of data — from gigabytes that fit in a spreadsheet to petabytes that need a cluster of machines. One major retailer processes over 1 million customer transactions per hour, feeding databases estimated at 2.5+ petabytes. A single-server database can't cope at that scale; you need distributed platforms like Hadoop or cloud data lakes. The real managerial issue isn't the storage bill — it's the organisational shift: new platforms, new skills, new vendor relationships.

**Velocity** is how fast data arrives and how fast you need to act on it. A credit card swipe has to be approved or declined in a fraction of a second while a fraud model scores it against millions of transaction patterns, locations, and device fingerprints. The executive job: match your infrastructure speed to your decision speed. Not every problem needs real-time streaming, but some decisions are worthless if the answer arrives even a day late.

**Variety** is the mix of structured (rows and columns), semi-structured (JSON, logs), and unstructured (text, images, video) data you need to combine. A single hospital patient has structured lab results, free-text clinical notes, scanned images, and wearable sensor data — four completely different formats describing one person. Most untapped value sits in the messy, unstructured 80%+ of enterprise data that most companies still ignore.

**Veracity** is how trustworthy the data is — the noise, duplicates, bias, and errors that quietly distort everything downstream. The same high-value customer might appear in three systems as three different records (typo'd name, outdated address, duplicate loyalty ID), looking like three unremarkable people instead of one important one. A fast, huge, varied dataset that's wrong is worse than no data — it produces confident, nicely formatted, completely wrong decisions.

**Value** is the actual business insight extracted from data. "Data is the new oil" is only half the story — crude oil in a barrel powers nothing. It has to be refined, transported, and burned in the right engine. Streaming platforms' recommendation engines are widely cited as saving roughly a billion dollars a year in avoided churn. The payoff — not the pipeline — is the point.

Value is the most important V because it's the only one that pays the bills. Volume, Velocity, Variety, and Veracity are costs — they describe how hard the data challenge is. Value is the return. An executive who builds infrastructure for massive Volume and real-time Velocity without a clear path to Value has built an expensive system that delivers nothing. Every data investment should start and end with: what decision will this enable, and what is it worth?

Together, the 5 Vs prevent both over-investment (calling everything "big data") and under-investment (dismissing real complexity as routine reporting). They're the executive's diagnostic panel for data problems — like a doctor's vital signs for patients.

```
                    ┌─────────┐
                    │  BIG    │
                    │  DATA   │
                    │  5 Vs   │
                    └────┬────┘
          ┌──────┬──────┼──────┬──────┐
          ▼      ▼      ▼      ▼      ▼
      Volume  Velocity Variety Veracity Value
      (size)  (speed) (formats)(trust) (payoff)
```

Bottom line: the 5 Vs turn the vague idea of "big data" into a structured assessment, always anchored by one question — where will the Value show up?

---

### Q2. Describe the Big Data Executive Mindset. What are the four key mindset shifts, and how do they change decision-making?
[Source: M1 S1, slides 7–8]

**Model Answer** (800–1000 words)

The Big Data Executive Mindset is a fundamental change in how leaders ask questions and make decisions once data becomes abundant, fast, and varied. It moves executives from reading reports about the past to steering decisions in the present. This isn't about adopting technology — it's about changing leadership behaviour.

The four shifts:

**Shift 1: From sampling to full population data.** Old analytics relied on samples because collecting everything was too expensive. Big data makes near-complete data feasible. Instead of surveying 500 customers, you can analyse the behaviour of all 5 million through their transactions, browsing, and support interactions. This kills sampling bias and reveals tiny patterns (like a micro-segment of 200 customers) that no sample would catch.

**Shift 2: From periodic reports to live signals.** Decisions move from calendar-driven (monthly reports) to event-driven (real-time alerts). A supply chain executive doesn't wait for the weekly inventory report — they get live alerts when stock drops below threshold, trucks deviate from routes, or supplier quality shifts. The decision cadence changes from monthly to right now.

**Shift 3: From "IT's problem" to executive ownership.** Data strategy is business strategy. When a retailer's predictive model sends targeted coupons based on purchase patterns, that's not an IT project — it's a marketing strategy with ethical, legal, and brand implications. Only business leaders can govern that. The executive must own the data agenda, not just consume its outputs.

**Shift 4: From "What happened?" to "What should we do?"** Analytics shifts from backward-looking (what sold last quarter?) to forward-looking (what's likely to happen and what action should we take?). This means executives need to trust probabilistic models and act under uncertainty.

These shifts change organisations in three ways. First, they spread data access — when everyone can see population-level data in real time, frontline staff can make data-informed decisions without waiting for the quarterly review. Second, they compress decision cycles — real-time signals need real-time responses, so organisations need to pre-approve automated decisions within guardrails. Third, they elevate data governance to the board level — when the CEO owns the data agenda, quality, privacy, and ethics become strategic concerns.

The Target pregnancy-prediction case shows all four shifts. Target used full purchase history (Shift 1), continuously scored shoppers (Shift 2), treated the model as a marketing tool owned by business leadership (Shift 3), and asked "who is likely pregnant now and what should we offer?" instead of "what did maternity sell last quarter?" (Shift 4). The case also shows the risk: the model correctly identified a pregnant teenager before her father knew, causing backlash that proved why executives — not algorithms — must own these decisions.

Bottom line: the Executive Mindset is the prerequisite for the rest of this course. Before choosing architecture, tools, or governance, a leader first needs to think differently about data: as complete rather than sampled, live rather than periodic, a business asset rather than IT's concern, and a basis for action rather than just retrospection.

---

### Q3. Using the 5-Question Big-Data Diagnostic, evaluate whether a business scenario qualifies as a genuine big-data problem. Use the card-network fraud screening example.
[Source: M1 S1, slides 9–10]

**Model Answer** (800–1000 words)

The 5-Question Big-Data Diagnostic helps executives tell genuine big-data problems from ordinary reporting gaps. The five questions:

1. Would a spreadsheet buckle under this volume?
2. Does new data arrive faster than a person can review it?
3. Does it arrive in more than one format?
4. Is the trustworthiness of the data itself part of the problem?
5. Would the decision change if you had the insight sooner?

Rule: **3 or more "yes" answers** = very likely a genuine big-data problem.

**Card-Network Fraud Screening:**

Consider a card network processing 50 million+ transactions per day.

**Q1: Would a spreadsheet buckle?** Absolutely. 50 million transactions a day, 1.5 billion rows a month with multiple attributes each (amount, location, merchant, device, time, cardholder history). You need distributed databases and processing clusters. **Yes.**

**Q2: Data faster than human review?** Yes. Roughly 580 transactions per second on average, much higher at peak. No human team can manually review each one. The system has to approve or decline within a fraction of a second while the customer stands at the counter. **Yes.**

**Q3: Multiple formats?** Yes. Structured transaction records (amount, time, merchant ID), semi-structured device fingerprints (JSON with browser/OS/screen data), geolocation signals, merchant scores, and increasingly unstructured data like behavioural biometrics (typing patterns, swipe gestures). **Yes.**

**Q4: Trustworthiness a problem?** Yes. Fraudsters actively make transactions look legitimate — stolen identities, spoofed locations, compromised devices. The data itself is adversarial. Plus merchant data has errors and customer addresses go stale. **Yes.**

**Q5: Faster insight valuable?** Absolutely. A fraud alert one second after approval = expensive investigation. A fraud alert 200 milliseconds before approval = prevented loss. The difference between useful and useless is sub-second. **Yes.**

**Result: 5/5 "yes."** Unambiguously a genuine big-data problem.

**Contrast: Monthly Regional Sales Summary**

A retail chain with 40 stores, one POS system, refreshed monthly into a spreadsheet the regional head reviews by hand.

1. Spreadsheet buckle? **No** — 40 stores, monthly aggregates.
2. Faster than human review? **No** — one monthly refresh.
3. Multiple formats? **No** — one POS system, structured only.
4. Trust issue? **No** — single source, standard reconciliation.
5. Speed matters? **No** — monthly cadence matches the planning cycle.

**Result: 0/5.** Not a big-data problem — good BI is enough.

```
┌───────────────────┬─────────────────┬─────────────────┐
│ Question          │ Fraud Screening │ Sales Summary   │
├───────────────────┼─────────────────┼─────────────────┤
│ 1. Volume         │ YES             │ NO              │
│ 2. Arrival speed  │ YES             │ NO              │
│ 3. Multiple types │ YES             │ NO              │
│ 4. Trust issue    │ YES             │ NO              │
│ 5. Speed matters  │ YES             │ NO              │
├───────────────────┼─────────────────┼─────────────────┤
│ RESULT            │ BIG DATA (5/5)  │ JUST BI (0/5)   │
└───────────────────┴─────────────────┴─────────────────┘
```

Key takeaway: big data is a judgement about the problem, not a label for any dataset that feels large. The 5-question diagnostic makes this judgement repeatable. An executive who runs it first will avoid both over-investing in problems that BI can solve and under-investing in problems that need distributed systems.

---

### Q4. Explain the five business value domains. For each, give one application and the metric it improves.
[Source: M1 S2, slide 22]

**Model Answer** (800–1000 words)

Big data creates measurable value in five areas: Customer, Operations, Finance, Workforce, and Risk. Each represents a category of decisions where data at scale can materially improve outcomes.

**1. Customer**

Uses big data for churn prediction, micro-segmentation, personalised recommendations, and lifetime value optimisation. Millions of transaction and interaction records reveal patterns about individual customers that sample-based surveys can't detect.

*Application*: A major streaming platform uses viewing history, search queries, time-of-day patterns, device preferences, and content-completion rates to personalise recommendations for hundreds of millions of subscribers.

*Metric*: **Customer churn rate.** The recommendation system is widely cited as saving roughly a billion dollars a year in avoided churn.

**2. Operations**

Applies big data to predictive maintenance, supply chain optimisation, quality control, and capacity planning. IoT sensor streams from machines and facilities predict failures before they happen.

*Application*: A manufacturing plant puts vibration, temperature, and pressure sensors on every critical machine. A predictive model spots patterns that come before breakdowns and schedules maintenance in advance.

*Metric*: **Unplanned downtime reduction.** Industry estimates: predictive maintenance can cut unplanned downtime by 30–50% and extend equipment life by 20–40%.

**3. Finance**

Uses big data for real-time fraud detection, credit scoring, claims assessment, and regulatory monitoring. Speed and accuracy are critical because losses pile up with every second of delay.

*Application*: A credit card network scores every transaction in real time against device fingerprints, geolocation, merchant reputation, and spending patterns — approving or flagging within milliseconds.

*Metric*: **Fraud loss rate.** Real-time scoring catches fraudulent transactions before they clear, across billions of transactions no human team could review.

**4. Workforce**

Applies big data to attrition prediction, workforce planning, skills-gap analysis, and hiring optimisation. Employee data from HR systems, performance reviews, engagement surveys, and external labour signals combine to predict risks.

*Application*: A tech company analyses employee tenure, compensation, performance, manager changes, and engagement survey responses to flag employees at high risk of leaving within six months. HR then intervenes with targeted retention.

*Metric*: **Voluntary attrition rate.** Targeted retention for at-risk employees saves significant recruitment costs (industry estimate: 50–200% of annual salary per senior departure).

**5. Risk**

Uses big data for portfolio risk, market risk, stress testing, and regulatory capital optimisation. Combines structured market data with unstructured signals (news, earnings calls, social media, geopolitical events).

*Application*: An investment bank combines real-time market feeds, historical trading data, macroeconomic indicators, and news sentiment to calculate Value-at-Risk with greater accuracy than structured-data-only models.

*Metric*: **Value-at-Risk accuracy and capital efficiency.** Better models mean holding capital more efficiently while staying compliant.

**Cross-Domain Synergy**

These five domains aren't siloed. The same data often serves multiple domains. A retail bank's transaction data feeds customer segmentation (Customer), branch staffing (Workforce), fraud detection (Finance), ATM maintenance (Operations), and portfolio stress-testing (Risk). A well-designed data platform multiplies its value across the whole organisation.

| Domain | Application | Key Metric |
|--------|-------------|------------|
| Customer | Personalised recommendations | Churn rate reduction |
| Operations | Predictive maintenance | Unplanned downtime reduction |
| Finance | Real-time fraud detection | Fraud loss rate |
| Workforce | Attrition prediction | Voluntary turnover rate |
| Risk | Portfolio VaR modelling | Capital efficiency |

Bottom line: the five domains give executives a structure for justifying data investments. Don't say "we need a data lake" — say "we'll use it for churn prediction (Customer), predictive maintenance (Operations), and fraud detection (Finance) — here's the ROI for each."

---

### Q5. Discuss ordinary analytics vs. genuinely big-data problems. What criteria tell them apart? Use two contrasting examples.
[Source: M1 S1, slides 8–10]

**Model Answer** (800–1000 words)

A core executive skill is telling ordinary analytics problems from genuine big-data problems. Getting this wrong is expensive in both directions: treating a simple problem as big data wastes money on unnecessary platforms; treating a real big-data problem as ordinary analytics means inadequate tools, missed insights, and failed projects.

The distinction rests on five dimensions:

| Dimension | Ordinary Analytics | Genuine Big-Data Problem |
|-----------|-------------------|--------------------------|
| **Data size** | Fits in Excel or a standard database | Outgrows standard tools — TB/PB scale |
| **Arrival pattern** | Periodic batches (daily/monthly) | Continuous or near real-time streams |
| **Format** | Mostly structured, usually one system | Structured + unstructured + semi-structured, many sources |
| **Typical tooling** | Spreadsheets, standard BI | Distributed storage and processing |
| **Decision cadence** | Matches the reporting calendar | Decision needed faster than manual review allows |

The 5-Question Diagnostic makes it concrete: (1) Would a spreadsheet buckle? (2) Data faster than human review? (3) More than one format? (4) Trust a problem? (5) Faster insight changes the decision? Three or more "yes" = big data.

**Example 1 — Ordinary: Monthly Regional Sales Summary**

A retail chain with 40 stores, one POS system, refreshed monthly into a spreadsheet. The data fits in Excel, arrives monthly, comes from one structured source, is reasonably clean, and the monthly cadence matches the planning cycle. Diagnostic: mostly "no." This is not a big-data problem. A dashboarding tool like Tableau on the POS database does the job. Spinning up a distributed platform here is like hiring a Formula 1 pit crew to change a bicycle tyre.

**Example 2 — Big Data: Card-Network Fraud Screening**

A card network processes 50 million+ transactions daily and must approve or decline each in under a second, combining device fingerprints, geolocation, merchant reputation, and real-time behavioural data. Data is massive (terabytes daily), arrives in continuous streams, combines multiple formats, is adversarially untrustworthy (fraudsters disguise transactions), and the decision is useless if delayed by even one second. Diagnostic: all "yes." This needs distributed streaming platforms and real-time ML scoring.

**Why It Matters**

The distinction isn't just about size. A 10 GB dataset arriving in real-time with five formats and serious quality issues is a bigger challenge than 100 GB arriving monthly in clean rows. As the faculty puts it: "big data is a judgement about the problem, not a label for any dataset that feels large."

Practical implications:
1. **Resources**: Big-data problems need distributed platforms and specialised engineering. Ordinary analytics needs BI tools and data-literate analysts.
2. **Timeline**: Big-data solutions take longer to build. Misclassifying an ordinary problem as big data delays results unnecessarily.
3. **Vendors**: The "big data" label attracts vendor pitches for enterprise platforms. The diagnostic protects you from being sold infrastructure you don't need.
4. **Risk**: Under-classifying a real big-data problem means building on inadequate infrastructure — system failures, missed decisions, costly rebuilds.

Bottom line: the ability to tell these apart is the first executive skill this course develops. Every later module — architecture, processing, pipelines, governance — assumes you've already done this diagnostic correctly.

---

## 5-Mark Questions

### Q1. What are the four mindset shifts that define the Big Data Executive Mindset? Briefly explain each.
[Source: M1 S1, slide 7]

**Model Answer** (400–500 words)

The Big Data Executive Mindset has four shifts:

**1. Sampling to population data.** Old analytics used representative samples because full data collection was too costly. Big data makes near-complete data feasible, killing sampling bias and revealing micro-patterns no sample would catch. You analyse all 5 million customer records, not survey 500.

**2. Periodic reports to live signals.** Decisions shift from calendar-driven (monthly reports) to event-driven (real-time alerts). A supply chain exec gets live stock warnings instead of a weekly inventory report.

**3. IT's problem to executive ownership.** Data strategy is business strategy. The executive owns the data agenda and its ethical implications — not just IT. A predictive model affecting customers is a business decision.

**4. "What happened?" to "What should we do?"** Analytics moves from backward-looking (what sold last quarter?) to forward-looking (what's likely next and what action should we take?). Executives must trust probabilistic models and act under uncertainty.

These shifts democratise data access, compress decision cycles, and make data governance a board-level concern. The Target pregnancy-prediction case shows all four: population purchase data (1), continuously scored (2), owned by marketing (3), asking "who's likely pregnant now?" not "what did maternity sell last quarter?" (4).

---

### Q2. Explain Veracity in big data. Why is it called the "hidden V"?
[Source: M1 S2, slide 19]

**Model Answer** (400–500 words)

Veracity is the trustworthiness and accuracy of data — noise, duplicates, bias, and errors that quietly distort everything downstream. While Volume and Velocity are visible and measurable, Veracity problems hide until a model makes a confidently wrong call.

Challenges include: duplicate records (same customer appearing three times with name variations), outdated info (addresses not updated after moves), systematic bias (training data that under-represents a group), missing values (sensors dropping data), and conflicting entries (three warehouses using different SKU names so "best-seller" lists disagree).

It's called the "hidden V" for three reasons. First, other Vs announce themselves: volume triggers storage alerts, velocity creates backlogs, variety creates integration errors. Veracity failures are silent — a wrong number looks exactly like a right one. Second, veracity problems compound: a slightly wrong record feeds a slightly wrong model that makes a slightly wrong recommendation, and the feedback loop reinforces the error. Third, most organisations measure Volume, Velocity, and Variety but rarely invest equally in quality monitoring.

The managerial discipline: before any analysis, ask — what could be wrong with this data, and how would we know?

---

### Q3. Describe the Data-to-Value five-step process. Which steps does Module 1 cover vs. later modules?
[Source: M1 S2, slide 23]

**Model Answer** (400–500 words)

The Data-to-Value process converts raw data traits into measurable business outcomes in five steps:

**Step 1: Spot the signal.** Notice a business question that data might answer. This needs the executive mindset shift from gut instinct to recognising data opportunities.

**Step 2: Score on the 5 Vs.** How big, fast, varied, and trustworthy is the data — really? This prevents both over- and under-classifying the problem.

**Step 3: Match the approach.** Pick tools and architecture proportional to the 5 Vs score. Low-V problem = BI tools. High-V problem = distributed platforms.

**Step 4: Convert to a decision.** Turn the analysis into one specific action — not a report, but an action.

**Step 5: Measure the value.** Did the decision actually pay off? Close the feedback loop with concrete outcome data.

**Module coverage**: Steps 1–2 = Module 1 (this module). Steps 3–4 = Modules 2–4 (architecture, processing, pipelines, analytics). Step 5 = Module 5 (governance, quality, evaluation).

This process is the spine of the entire course. An MBA grad who can walk a stakeholder through all five steps shows the judgement that separates a data-aware leader from one who delegates everything to IT.

---

### Q4. How does the Target pregnancy-prediction case illustrate the Big Data Executive Mindset? What lesson does it teach about executive responsibility?
[Source: M1 S1, slides 5–6]

**Model Answer** (400–500 words)

A major US retailer built a model that scored every shopper for pregnancy likelihood using ordinary purchase history. Small buying shifts — unscented lotion, cotton balls, mineral supplements, bigger handbags — were individually weak signals but collectively a strong predictor. The model triggered baby-product coupons mailed to a teenager's home. Her father was furious until he discovered the store's model had been right before he knew.

This shows all four mindset shifts: **Population data** (thousands of purchases per customer, not a sample), **Continuous scoring** (every shopping visit, not quarterly), **Business ownership** (a marketing tool with brand and ethical weight, not an IT experiment), **Prescriptive action** ("who's likely pregnant now?" not "what did maternity sell last quarter?").

The key lesson: the algorithm didn't make a decision — it made a prediction. The decision to act on it (mailing coupons to a household without considering sensitivity) was a business call that executives should have governed. The technical capability existed; what was missing was executive judgement about when and how to use it. Data-driven capabilities need data-driven governance, and governance is an executive job.

---

### Q5. Compare Volume and Velocity. How do they differ in managerial implications?
[Source: M1 S2, slides 16–17]

**Model Answer** (400–500 words)

**Volume** = how much data exists. High Volume means data outgrows single-machine tools and needs distributed storage and processing (HDFS, Spark, cloud data lakes). The managerial implication: a platform investment decision. When the nightly batch can't finish before stores reopen, you need different infrastructure. This is typically a capital expenditure decision with a long planning horizon.

**Velocity** = how fast data arrives and how fast you must decide. High Velocity means the decision window is shorter than the processing cycle, needing stream processing or real-time scoring. The managerial implication: a decision-architecture question. Which decisions justify real-time infrastructure? Which can wait for batch?

The key difference: Volume is about **capacity** (can we store and process all this?) while Velocity is about **latency** (can we act fast enough?). You can have a Volume problem without a Velocity problem (terabytes processed weekly in batch) or a Velocity problem without a Volume problem (low-volume IoT alerts needing instant action). Different responses: Volume calls for bigger platforms; Velocity calls for faster pipelines.

A common executive mistake: assuming big data must also be fast data, or vice versa. The 5 Vs framework prevents this by requiring you to assess each dimension independently.

---

## 4-Mark Questions

### Q1. List the five questions in the Big-Data Diagnostic and the threshold for classifying a problem as big data.
[Source: M1 S1, slide 9]

**Model Answer** (250–350 words)

1. **Would a spreadsheet buckle under this volume?** — tests whether data exceeds single-machine capacity.
2. **Does new data arrive faster than a person can review it?** — tests whether speed exceeds human processing.
3. **Does it arrive in more than one format — text, images, logs, sensor feeds?** — tests format variety.
4. **Is the trustworthiness of the data itself part of the problem?** — tests for veracity issues (noise, duplication, bias).
5. **Would the decision change if you had the insight sooner?** — tests whether faster processing improves the decision.

**Threshold**: 3 or more "yes" answers = very likely a genuine big-data problem, not just a reporting gap.

---

### Q2. Explain Variety with a healthcare example.
[Source: M1 S2, slide 18]

**Model Answer** (250–350 words)

Variety is the mix of structured, semi-structured, and unstructured data you need to combine. In healthcare, a single patient record includes: **structured** lab values (numbers in fixed columns), **semi-structured** clinical notes (some template fields, some free text), **unstructured** imaging (radiology PDFs, X-rays), and **real-time sensor streams** from wearables (heart rate, blood oxygen, steps).

Four formats, one patient — and no single tool can query them all. Lab values sit in a relational database; notes need language processing; images need computer vision; sensor streams need time-series processing. The challenge isn't just technical (combining formats) but organisational (different departments own different data with different quality standards).

The executive insight: most untapped value sits in the unstructured 80%+ of data that most organisations still leave unanalysed.

---

### Q3. Why does the faculty say "Value is the only V that pays the bills"? Explain with an example.
[Source: M1 S2, slide 20]

**Model Answer** (250–350 words)

The first four Vs — Volume, Velocity, Variety, Veracity — describe the data challenge. They're all costs: infrastructure for storage, platforms for speed, integration for formats, quality controls for trust. None of them generate revenue or cut costs by themselves.

Value is the business outcome these costs enable — the decision that improves retention, prevents fraud, optimises supply chains, or reduces risk. Without Value, the other four Vs are expensive plumbing.

Example: A streaming platform invests in petabyte storage (Volume), real-time processing (Velocity), combining viewing data with search and device logs (Variety), and cleaning noisy feedback signals (Veracity). The Value: a recommendation engine saving an estimated billion dollars a year in avoided churn. The pipeline costs millions; the retained subscribers are worth billions. Value justifies the investment; the other Vs are the cost of getting there.

If you can't state the Value in concrete terms, you haven't finished the 5 Vs assessment.

---

### Q4. Describe the peak-season apparel retailer case and map it to the 5 Vs.
[Source: M1 S2, slide 21]

**Model Answer** (250–350 words)

During Black Friday week, a national clothing retailer hit all 5 Vs at once:

- **Volume**: Transactions tripled across 600 stores and the app; the nightly batch couldn't finish before stores reopened.
- **Velocity**: Inventory and pricing decisions needed same-day instead of weekly.
- **Variety**: POS data, app clickstream, call-centre transcripts, and supplier feeds all needed combining, but no single system saw the whole picture.
- **Veracity**: Three warehouses used three different SKU-naming systems, so "best-seller" lists disagreed depending on who you asked.
- **Value**: The one insight that mattered — which 200 SKUs to air-freight vs. sea-freight. That single decision saved the season; everything else was plumbing.

This shows that big-data challenges rarely present one V alone. The executive skill: diagnose all five at once and focus on the Value insight that justifies the investment.

---

### Q5. Explain the course assessment structure (IA1, IA2, IA3, End-Term) and how it mirrors the course logic.
[Source: M1 S1, slide 11]

**Model Answer** (250–350 words)

Four assessments, each building on the last:

- **IA 1 — Big Data Opportunity Diagnosis (Session 9)**: Diagnose a real business situation — does it qualify as big data? Uses the 5 Vs and diagnostic from Modules 1–3.
- **IA 2 — Scalable Analytics Pipeline Design (Session 14)**: Design a data pipeline for a specific problem, picking architecture proportional to the diagnosis. Modules 2–4.
- **IA 3 — Investment Review Board (Session 18)**: Defend a big-data investment proposal before a simulated board, combining diagnosis, design, governance, and ROI. Modules 1–5.
- **End-Term — Written Exam (Session 20)**: Comprehensive, all modules.

The structure mirrors the course logic: **diagnose** (is this big data?) → **design** (what architecture?) → **defend** (is it worth it?). Each assessment needs skills from all preceding modules. Minimum 50% required in each component to pass.

---

## Definitions and Short Notes

### Big Data
> Datasets and challenges marked by high Volume, Velocity, Variety, and Veracity that go beyond what standard tools can handle, where the goal is to extract Value as decision-relevant business insights.

### Volume
> The sheer scale of data — gigabytes to petabytes — that outgrows single-machine tools and needs distributed storage and processing.

### Velocity
> How fast data arrives and how fast decisions must follow, determining whether batch, micro-batch, or real-time stream processing is needed.

### Variety
> The diversity of formats (structured, semi-structured, unstructured) and sources that must be combined for a complete picture.

### Veracity
> Trustworthiness, accuracy, and uncertainty of data — noise, duplication, bias, and error that quietly distort downstream analytics.

### Value
> The decision-relevant business outcome extracted from data — the only V that justifies the investment in the other four.

### Big Data Executive Mindset
> A shift in how leaders think and decide once data becomes abundant and fast — from sampling to population, periodic to continuous, IT-owned to executive-owned, and descriptive to prescriptive.

### 5-Question Big-Data Diagnostic
> A five-question test (volume, speed, format diversity, trustworthiness, time-sensitivity) where 3+ "yes" answers indicate a genuine big-data problem.

### Business Value Domains
> Five strategic areas — Customer, Operations, Finance, Workforce, Risk — where big-data decisions create measurable impact.

### Data-to-Value Process
> A five-step workflow — Spot the signal, Score on the 5 Vs, Match the approach, Convert to a decision, Measure the value — that turns data traits into business outcomes.

### Structured Data
> Data in fixed rows and columns with a set schema (databases, spreadsheets) that you can query directly with SQL.

### Unstructured Data
> Data with no set format — free text, images, audio, video, PDFs — that needs specialised processing (NLP, computer vision) before analysis.

---

## Difference-Between Questions

### Ordinary Analytics vs. Genuinely Big-Data Problems
[Source: M1 S1, slide 8]

| Dimension | Ordinary Analytics | Big-Data Problem |
|-----------|-------------------|--------------------------|
| **Data size** | Fits in Excel or standard DB | Outgrows standard tools — TB/PB scale |
| **Arrival pattern** | Periodic batches (daily/monthly) | Continuous or near real-time streams |
| **Format** | Mostly structured, one system | Structured + unstructured, many sources |
| **Typical tools** | Spreadsheets, BI/reporting | Distributed storage and processing |
| **Decision cadence** | Matches the reporting calendar | Faster than manual review allows |

### Volume vs. Velocity
[Source: M1 S2, slides 16–17]

| Dimension | Volume | Velocity |
|-----------|--------|-----------|
| **Core question** | How much data? | How fast does it arrive / must we act? |
| **Challenge type** | Capacity — can we store and process it? | Latency — can we act fast enough? |
| **Infrastructure** | Bigger/distributed platforms (HDFS, data lakes) | Faster pipelines (Kafka, stream processing) |
| **Planning horizon** | Capital expenditure, long cycle | Decision architecture, matching cadence |
| **Failure mode** | Batch jobs that can't finish in time | Insights that arrive after the window closes |
| **Example** | 2.5 PB retail transaction DB | Card-fraud scoring in milliseconds |

### Descriptive vs. Prescriptive Analytics (Mindset Shift 4)
[Source: M1 S1, slides 7–8]

| Dimension | Descriptive | Prescriptive |
|-----------|-------------|---------------|
| **Core question** | What happened? | What should we do? |
| **Time** | Backward-looking | Forward-looking |
| **Output** | Reports, dashboards | Recommended actions, automated decisions |
| **Executive role** | Interpreting history | Acting on predictions under uncertainty |
| **Data needs** | Periodic, structured, single-source | Continuous, multi-format, real-time |
| **Example** | Quarterly sales report | Real-time churn score triggering a retention offer |

### Structured vs. Unstructured Data
[Source: M1 S2, slide 18]

| Dimension | Structured | Unstructured |
|-----------|------------|---------------|
| **Format** | Fixed rows and columns, set schema | No set format or schema |
| **Examples** | Database tables, spreadsheets, transaction logs | Free text, images, audio, video, PDFs |
| **Query method** | SQL, standard queries | NLP, computer vision, specialised processing |
| **% of enterprise data** | ~20% | ~80% |
| **Analysis maturity** | Well understood, widely tooled | Frontier — often still unanalysed |
| **Storage** | Relational databases | Data lakes, object storage |

---

## Case-Based Questions

### Case 1: Retail Customer Churn Prediction
[Source: Syllabus Business Problem #1; M1 S2, slide 22]

**Scenario**: MegaMart, a national grocery chain with 800 stores and 15 million loyalty-card members, sees a 3% churn increase over the past year. Marketing currently reviews a monthly churn report from POS data alone. The CTO proposes a big-data initiative to predict churn and enable micro-targeted retention.

**Question**: (a) Apply the 5-Question Diagnostic. (b) Map the initiative to the 5 Vs. (c) Which value domain(s)? What metrics?

**Model Answer**:

**(a) Diagnostic:**
1. Spreadsheet buckle? **Yes** — 15 million customers, years of history, multiple visits per week = billions of rows.
2. Faster than human review? **Potentially yes** — if scoring needs to happen at the point of interaction (app notification, checkout).
3. Multiple formats? **Yes** — POS (structured), app logs (semi-structured), call-centre transcripts (unstructured), social media (unstructured).
4. Trust issue? **Yes** — shared loyalty cards, inconsistent addresses, customers who shop without scanning appear as "churned" when they've just gone anonymous.
5. Faster insight? **Yes** — a retention offer before the next visit beats discovering someone left.

Result: 4–5 "yes." Genuine big-data problem.

**(b) 5 Vs:**
- **Volume**: Billions of transaction records across 800 stores over years.
- **Velocity**: Churn scores need at least daily updates; real-time app scoring would enable in-session offers.
- **Variety**: POS, app clickstream, call-centre transcripts, loyalty data, maybe social media.
- **Veracity**: Shared cards, anonymous shopping, address inconsistencies, difficulty separating "churned" from "reduced frequency."
- **Value**: Targeted retention for highest-risk, highest-value customers.

**(c) Domain and Metrics:**
Mainly **Customer** (churn prediction, micro-segmentation). Secondary: **Finance** (retained revenue). Metrics: churn rate reduction (%), retained annual revenue, campaign ROI (retention offer cost vs. value of retained customers), customer lifetime value uplift.

---

### Case 2: Peak-Season Logistics at a Fashion Retailer
[Source: M1 S2, slide 21]

**Scenario**: FastFashion Inc., 600 stores + growing e-commerce app, faces its biggest Black Friday yet. Last year's weekly planning was too slow — stockouts of top sellers, overstock of slow movers. The supply chain team estimates one correct air-freight vs. sea-freight call for the top 200 SKUs could save $4 million. Current setup: separate POS, e-commerce, call-centre, and supplier systems that don't share data.

**Question**: (a) Walk through the Data-to-Value five steps. (b) Map the 5 Vs challenges. (c) What's the single most important Value insight, and why does it justify investment?

**Model Answer**:

**(a) Data-to-Value:**
1. **Spot the signal**: Supply chain sees recurring stockouts and overstock every peak season — the weekly planning cycle can't keep up with Black Friday demand shifts.
2. **Score the 5 Vs**: Volume (transactions triple across 600 stores + app), Velocity (same-day decisions, not weekly), Variety (POS + clickstream + call-centre + supplier), Veracity (three warehouses, three SKU-naming systems), Value (the air-freight vs. sea-freight call for 200 SKUs).
3. **Match the approach**: Integrate all four sources into one data platform with daily (or intra-day) refresh. Build a demand-forecasting model combining in-store and online signals.
4. **Convert to a decision**: Rank the top 200 SKUs by demand urgency; route high-urgency to air freight, low-urgency to sea freight.
5. **Measure the value**: Compare actual stockout rates, overstock disposal costs, and freight spending against last year.

**(b) 5 Vs:**
- **Volume**: Transaction volume triples during peak week; nightly batch can't finish before stores reopen.
- **Velocity**: Inventory and pricing shift from weekly to same-day.
- **Variety**: Four separate systems (POS, app, call-centre, supplier) with no shared data layer.
- **Veracity**: Three different SKU-naming conventions causing conflicting best-seller lists.
- **Value**: The air-freight vs. sea-freight decision for 200 SKUs saves the season.

**(c) Key Value Insight:**
Which 200 SKUs to air-freight vs. sea-freight. This justifies the investment because: (1) $4 million savings far exceeds the data integration cost; (2) the decision is time-critical — must happen during peak season, not after; (3) no single system can provide it alone, so integration is required. As the faculty says: "that single decision saved the season — everything else was plumbing."