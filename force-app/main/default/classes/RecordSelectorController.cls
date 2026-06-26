public with sharing class RecordSelectorController {
    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecordsByParent(
        String objectApiName,
        String parentFieldApiName,
        String parentFieldValue,
        String childRecordLabelField,
        String sortOrder
    ) {
        Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(objectApiName);
        if (sObjectType == null) {
            AuraHandledException ex = new AuraHandledException('Invalid object API name: ' + objectApiName);
            ex.setMessage('Invalid object API name: ' + objectApiName);
            throw ex;
        }

        Map<String, Schema.SObjectField> fields = sObjectType.getDescribe().fields.getMap();

        if (!fields.containsKey(parentFieldApiName.toLowerCase())) {
            AuraHandledException ex = new AuraHandledException('Invalid parent field: ' + parentFieldApiName);
            ex.setMessage('Invalid parent field: ' + parentFieldApiName);
            throw ex;
        }
        if (!fields.containsKey(childRecordLabelField.toLowerCase())) {
            AuraHandledException ex = new AuraHandledException('Invalid label field: ' + childRecordLabelField);
            ex.setMessage('Invalid label field: ' + childRecordLabelField);
            throw ex;
        }

        // Use schema-derived names so user input never reaches the query string
        String validatedObject = sObjectType.getDescribe().getName();
        String validatedParentField = fields.get(parentFieldApiName.toLowerCase()).getDescribe().getName();
        String validatedLabelField = fields.get(childRecordLabelField.toLowerCase()).getDescribe().getName();
        String validatedSortOrder = sortOrder == 'DESC' ? 'DESC' : 'ASC';

        String selectClause = validatedLabelField.equalsIgnoreCase('Id')
            ? 'Id'
            : 'Id, ' + validatedLabelField;

        String query =
            'SELECT ' + selectClause +
            ' FROM ' + validatedObject +
            ' WHERE ' + validatedParentField + ' = :parentFieldValue' +
            ' ORDER BY ' + validatedLabelField + ' ' + validatedSortOrder;

        return Database.query(query, AccessLevel.USER_MODE);
    }
}
