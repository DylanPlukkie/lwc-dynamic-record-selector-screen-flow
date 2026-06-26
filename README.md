# Dynamic Child Record Selector — Screen Flow LWC

A reusable Salesforce Lightning Web Component for use in **Screen Flows**. It renders a picklist that dynamically loads child records for any object and parent lookup field — no code changes needed per use case.

---

## Demo

<video src="dynamic-record-selector-demo.mp4" controls title="Dynamic Record Selector Demo"></video>

---

## Features

- Works with any standard or custom object
- Configurable parent lookup field and value at runtime
- Configurable display field, label, and sort order
- Optional required validation enforced by the Flow runtime
- Outputs the selected record ID for use in subsequent Flow steps
- Schema-validated dynamic SOQL — safe against injection by design

---

## Requirements

- Salesforce API version **62.0 or higher**
- Salesforce CLI (`sf`) for deployment

---

## Installation

Deploy to your org using the Salesforce CLI:

```bash
sf project deploy start --source-dir force-app
```

Or deploy to a scratch org:

```bash
sf org create scratch -f config/project-scratch-def.json -a my-scratch-org
sf project deploy start --target-org my-scratch-org
```

---

## Usage in Flow Builder

1. Open **Flow Builder** and create or edit a **Screen Flow**
2. Add a **Screen** element
3. In the component panel, search for **Dynamic Child Record Selector**
4. Drag it onto the screen canvas
5. Configure the input properties (see table below)
6. Use the **Selected Record ID** output variable in downstream Flow elements

---

## Properties

### Input

| Property                 | Type    | Required | Default           | Description                                                                                     |
| ------------------------ | ------- | -------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| Child Object API Name    | String  | Yes      | —                 | API name of the object to query, e.g. `Contact`, `Invoice__c`                                   |
| Parent Field API Name    | String  | Yes      | —                 | API name of the lookup field on the child object, e.g. `AccountId`, `Project__c`                |
| Parent Field Value       | String  | Yes      | —                 | Record ID of the parent to filter by                                                            |
| Child Record Label Field | String  | No       | `Name`            | API name of the field shown as the option label in the picklist, e.g. `FirstName`, `Subject__c` |
| Sort Order               | String  | No       | `ASC`             | Sort direction: `ASC` or `DESC`                                                                 |
| Label                    | String  | No       | `Select a record` | Label displayed above the picklist                                                              |
| Required                 | Boolean | No       | `false`           | When enabled, the user must make a selection before the Flow can proceed to the next screen     |

### Output

| Property           | Type   | Description                                     |
| ------------------ | ------ | ----------------------------------------------- |
| Selected Record ID | String | The Salesforce record ID of the selected option |

---

## Example configurations

**Contacts for an Account**

| Property                 | Value              |
| ------------------------ | ------------------ |
| Child Object API Name    | `Contact`          |
| Parent Field API Name    | `AccountId`        |
| Parent Field Value       | `{!recordId}`      |
| Child Record Label Field | `Name`             |
| Sort Order               | `ASC`              |
| Label                    | `Select a contact` |

**Custom child records**

| Property                 | Value                  |
| ------------------------ | ---------------------- |
| Child Object API Name    | `Project_Task__c`      |
| Parent Field API Name    | `Project__c`           |
| Parent Field Value       | `{!selectedProjectId}` |
| Child Record Label Field | `Task_Name__c`         |
| Sort Order               | `ASC`                  |
| Label                    | `Select a task`        |

---

## Security

The Apex controller validates all object and field names against the Salesforce schema before they are used in a query. User-provided values are never concatenated into the query string. The query runs with `AccessLevel.USER_MODE`, which enforces the running user's object and field-level security permissions.

---

## License

MIT
