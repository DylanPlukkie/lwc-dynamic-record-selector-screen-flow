import { LightningElement, api, wire } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";
import getRecordsByParent from "@salesforce/apex/RecordSelectorController.getRecordsByParent";

export default class DynamicRecordSelector extends LightningElement {
  @api objectApiName;
  @api parentFieldApiName;
  @api parentFieldValue;
  @api childRecordLabelField = "Name";
  @api sortOrder = "ASC";
  @api label = "Select a record";
  @api required = false;
  @api value;

  recordOptions = [];
  error;

  @wire(getRecordsByParent, {
    objectApiName: "$objectApiName",
    parentFieldApiName: "$parentFieldApiName",
    parentFieldValue: "$parentFieldValue",
    childRecordLabelField: "$childRecordLabelField",
    sortOrder: "$sortOrder",
  })
  wiredRecords({ data, error }) {
    if (data) {
      this.recordOptions = data.map((record) => ({
        label: record[this.childRecordLabelField],
        value: record.Id,
      }));
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.recordOptions = [];
    }
  }

  handleChange(event) {
    this.value = event.detail.value;
    this.dispatchEvent(new FlowAttributeChangeEvent("value", this.value));
  }

  @api
  validate() {
    if (this.required && !this.value) {
      return {
        isValid: false,
        errorMessage: "Please make a selection.",
      };
    }
    return { isValid: true };
  }
}
