
# Unit, Integration, and API Testing — Differences & How‑To

## 1) Unit Testing
**Purpose:** Verify a single, smallest unit (function/class) **in isolation**.

**Traits**
- **Scope:** One function/method  
- **Isolation:** Dependencies mocked/stubbed  
- **Speed:** Milliseconds; runs locally and in CI  
- **Common tools:** JUnit / NUnit / pytest / Jest

**How to do it**
1. Identify a pure, deterministic unit.  
2. **Mock** external calls (DB, network, file I/O).  
3. Write **arrange–act–assert** tests for happy paths and edge cases.  
4. Run on every commit in CI for fast feedback.

**Example (Python / pytest)**
```python
# src/math_utils.py
def add(a, b): return a + b

# tests/test_math_utils.py
from src.math_utils import add

def test_add_returns_sum():
    assert add(2, 3) == 5
```

**Best practices**
- Small, independent tests; one assertion/behavior per test
- Clear names: `Function_Scenario_Expectation`
- Aim for **meaningful coverage** (critical logic first), not just %


## 2) Integration Testing
**Purpose:** Validate that **multiple units work together** (e.g., service ↔ repo ↔ DB).

**Traits**
- **Scope:** Two+ modules/components  
- **Environment:** Real or realistic (containers, in‑memory DB, test doubles where needed)  
- **Speed:** Slower than unit tests  
- **Common tools:** JUnit + Spring/Testcontainers, pytest fixtures, Jest + real services

**How to do it**
1. Compose collaborating modules (no UI).  
2. Provision a **representative environment** (Docker/Testcontainers or in‑memory DB).  
3. Seed test data; verify **data flow and error handling** across layers.  
4. Run **after** unit tests in CI.

**Example outline**
```text
Arrange: Start containerized DB → apply schema → seed fixtures
Act:     Call service method that queries DB
Assert:  Returned DTO matches seeded data and transaction semantics
```


## 3) API Testing
**Purpose:** Ensure API **endpoints and contracts** behave correctly (functionality, errors, security).

**Traits**
- **Scope:** HTTP surface (GET/POST/PUT/DELETE), status codes, headers, payloads  
- **Focus:** Functional correctness first; also performance and security checks  
- **Common tools:** Postman/Newman, REST Assured, Supertest, pytest + requests

**How to do it**
1. Define scenarios per endpoint: **happy**, **boundary**, **negative**, **authz/authn**.  
2. Validate **status**, **headers**, **schema** (JSON Schema/OpenAPI).  
3. Add contract tests (e.g., Pact) for producer/consumer compatibility.  
4. Automate in CI; run smoke on every PR and fuller suites nightly.

**Example (Python / requests)**
```python
import os, requests

BASE = os.getenv("API_BASE", "https://api.example.com")

def test_get_user_200():
    r = requests.get(f"{BASE}/users/1")
    assert r.status_code == 200
    body = r.json()
    assert "id" in body and body["id"] == 1
    assert "name" in body
```


## Key Differences at a Glance

| Aspect          | Unit Testing                | Integration Testing             | API Testing                          |
|-----------------|-----------------------------|----------------------------------|--------------------------------------|
| **Focus**       | Single unit logic           | Interactions among modules       | External API surface & contracts     |
| **Dependencies**| Mocked/stubbed              | Realistic (DB, queues, services) | Real services or dedicated test env  |
| **Speed**       | Fastest                     | Moderate                         | Slowest                              |
| **When**        | During development          | After unit tests                 | After integration tests              |
| **Failure Cost**| Low (quick fix)             | Medium (boundary assumptions)    | High (breaking clients/integrations) |


## CI/CD Placement (minimal)
- **PR**: Unit (all) → Integration (targeted) → API **smoke**  
- **Nightly**: Full integration + API suites, plus performance/security subsets  
- **Gates**: Fail build on contract/schema drift; publish coverage & reports


## Minimal Checklists

**Unit**
- [ ] Mocks for all I/O  
- [ ] Edge cases covered (null/empty, limits, errors)  
- [ ] Deterministic; no time/network/file flakiness

**Integration**
- [ ] Ephemeral environment (containers/in‑memory)  
- [ ] Seeded test data & teardown  
- [ ] Validates transactions, retries, timeouts

**API**
- [ ] Happy, boundary, and negative paths  
- [ ] Auth/authz, rate limits, idempotency  
- [ ] Schema validation (OpenAPI/JSON Schema)  
- [ ] Contract tests for upstream/downstream


## Choosing What to Test Where
- **Unit** → Pure logic and branching rules  
- **Integration** → Cross‑module behavior, DB queries, messaging  
- **API** → Endpoint correctness, serialization, security and compatibility


---

### Want me to…
- generate a **Test Pyramid** diagram,
- turn the checklists into a **ready‑to‑run CI template** (GitHub Actions/Azure Pipelines),
- or **draft sample tests** for your stack (Python, Java, or JavaScript)?