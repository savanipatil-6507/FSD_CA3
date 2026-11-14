# Project 3: Node.js Hospital Appointment Server Utility (Without Express)

## Overview
A server-side utility for hospital appointment management built strictly with **Node.js core modules** (`http`, `fs`, `path`, `events`, and `stream`) with **zero external web frameworks** (no Express).

---

## Technical Highlights
1. **Core HTTP Server**:
   - Implements native `http.createServer` handling routing, headers, status codes, and JSON payloads.
2. **File System (`fs`) & Path Modules**:
   - `path.join(__dirname, 'data', 'appointments.json')` ensures cross-platform path resolution.
   - Atomic file reading and writing using `fs.promises.readFile` and `fs.promises.writeFile`.
3. **EventEmitter & Streams**:
   - Subclass of `EventEmitter` (`AppointmentNotifier`) that emits events:
     - `'appointment:created'`
     - `'appointment:updated'`
     - `'appointment:deleted'`
   - Writable file stream (`fs.createWriteStream`) to record audit logs in `logs/appointment-audit.log`.
   - Readable file stream (`fs.createReadStream`) piping appointment records directly to client responses via `pipe(res)` for export.
4. **Input Validation & Meaningful Error Messages**:
   - Comprehensive request parsing and validation (required patient details, phone validation, date checks).
   - Standard HTTP status codes (200, 201, 400, 404, 500).

---

## REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Server status and documentation |
| `GET` | `/api/appointments` | Retrieve all appointment records |
| `GET` | `/api/appointments/:id` | Retrieve a specific appointment by ID |
| `POST` | `/api/appointments` | Create new appointment record (validates input & triggers event) |
| `PUT` | `/api/appointments/:id` | Update appointment details or status |
| `DELETE` | `/api/appointments/:id` | Delete appointment record |
| `GET` | `/api/appointments/stream/export` | Stream records file as attachment using `ReadableStream` |
| `GET` | `/api/logs` | View audit trail from writable stream |

---

## Running the Server & Tests

### Start the Server
```bash
cd Project3
npm start
```
The server will start at `http://localhost:4000`.

### Run Automated Integration Tests
```bash
npm test
```

