import { createElement } from "lwc";
import DynamicRecordSelector from "c/dynamicRecordSelector";
import getRecordsByParent from "@salesforce/apex/RecordSelectorController.getRecordsByParent";

jest.mock(
  "@salesforce/apex/RecordSelectorController.getRecordsByParent",
  () => ({ default: jest.fn() }),
  { virtual: true },
);

const MOCK_RECORDS = [
  { Id: "003000000000001", Name: "Alice Smith" },
  { Id: "003000000000002", Name: "Bob Jones" },
];

async function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("c-dynamic-record-selector", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("renders combobox with options mapped from wire data", async () => {
    getRecordsByParent.mockResolvedValue(MOCK_RECORDS);

    const element = createElement("c-dynamic-record-selector", {
      is: DynamicRecordSelector,
    });
    element.objectApiName = "Contact";
    element.parentFieldApiName = "AccountId";
    element.parentFieldValue = "001000000000001";
    document.body.appendChild(element);

    await flushPromises();

    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    expect(combobox).not.toBeNull();
    expect(combobox.options).toHaveLength(2);
    expect(combobox.options[0].label).toBe("Alice Smith");
    expect(combobox.options[0].value).toBe("003000000000001");
  });

  it("uses childRecordLabelField to map option labels", async () => {
    const records = [
      { Id: "003000000000001", FirstName: "Alice" },
      { Id: "003000000000002", FirstName: "Bob" },
    ];
    getRecordsByParent.mockResolvedValue(records);

    const element = createElement("c-dynamic-record-selector", {
      is: DynamicRecordSelector,
    });
    element.objectApiName = "Contact";
    element.parentFieldApiName = "AccountId";
    element.parentFieldValue = "001000000000001";
    element.childRecordLabelField = "FirstName";
    document.body.appendChild(element);

    await flushPromises();

    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    expect(combobox.options[0].label).toBe("Alice");
  });

  it("dispatches flowattributechange event on selection", async () => {
    getRecordsByParent.mockResolvedValue(MOCK_RECORDS);

    const element = createElement("c-dynamic-record-selector", {
      is: DynamicRecordSelector,
    });
    element.objectApiName = "Contact";
    element.parentFieldApiName = "AccountId";
    element.parentFieldValue = "001000000000001";
    document.body.appendChild(element);

    await flushPromises();

    const handler = jest.fn();
    element.addEventListener("flowattributechange", handler);

    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    combobox.dispatchEvent(
      new CustomEvent("change", { detail: { value: "003000000000001" } }),
    );

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("validate returns invalid when required and nothing selected", () => {
    getRecordsByParent.mockResolvedValue([]);

    const element = createElement("c-dynamic-record-selector", {
      is: DynamicRecordSelector,
    });
    element.objectApiName = "Contact";
    element.parentFieldApiName = "AccountId";
    element.parentFieldValue = "001000000000001";
    element.required = true;
    document.body.appendChild(element);

    const result = element.validate();
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeTruthy();
  });

  it("validate returns valid when required and a value is selected", async () => {
    getRecordsByParent.mockResolvedValue(MOCK_RECORDS);

    const element = createElement("c-dynamic-record-selector", {
      is: DynamicRecordSelector,
    });
    element.objectApiName = "Contact";
    element.parentFieldApiName = "AccountId";
    element.parentFieldValue = "001000000000001";
    element.required = true;
    document.body.appendChild(element);

    await flushPromises();

    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    combobox.dispatchEvent(
      new CustomEvent("change", { detail: { value: "003000000000001" } }),
    );

    expect(element.validate().isValid).toBe(true);
  });

  it("validate returns valid when not required and nothing selected", () => {
    getRecordsByParent.mockResolvedValue([]);

    const element = createElement("c-dynamic-record-selector", {
      is: DynamicRecordSelector,
    });
    element.objectApiName = "Contact";
    element.parentFieldApiName = "AccountId";
    element.parentFieldValue = "001000000000001";
    document.body.appendChild(element);

    expect(element.validate().isValid).toBe(true);
  });
});
