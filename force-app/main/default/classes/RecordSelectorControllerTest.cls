@IsTest
private class RecordSelectorControllerTest {
    @TestSetup
    static void setup() {
        Account account = new Account(Name = 'Test Account');
        insert account;

        insert new List<Contact>{
            new Contact(FirstName = 'Alpha', LastName = 'Test', AccountId = account.Id),
            new Contact(FirstName = 'Beta', LastName = 'Test', AccountId = account.Id)
        };
    }

    @IsTest
    static void returnsRecordsOrderedAscending() {
        Account account = [SELECT Id FROM Account LIMIT 1];

        Test.startTest();
        List<SObject> records = RecordSelectorController.getRecordsByParent(
            'Contact', 'AccountId', account.Id, 'FirstName', 'ASC'
        );
        Test.stopTest();

        Assert.areEqual(2, records.size(), 'Expected two contacts');
        Assert.areEqual('Alpha', (String) records[0].get('FirstName'), 'Expected Alpha first when sorting ASC');
    }

    @IsTest
    static void returnsRecordsOrderedDescending() {
        Account account = [SELECT Id FROM Account LIMIT 1];

        Test.startTest();
        List<SObject> records = RecordSelectorController.getRecordsByParent(
            'Contact', 'AccountId', account.Id, 'FirstName', 'DESC'
        );
        Test.stopTest();

        Assert.areEqual(2, records.size(), 'Expected two contacts');
        Assert.areEqual('Beta', (String) records[0].get('FirstName'), 'Expected Beta first when sorting DESC');
    }

    @IsTest
    static void returnsEmptyListWhenNoChildRecords() {
        Account emptyAccount = new Account(Name = 'Empty Account');
        insert emptyAccount;

        Test.startTest();
        List<SObject> records = RecordSelectorController.getRecordsByParent(
            'Contact', 'AccountId', emptyAccount.Id, 'Name', 'ASC'
        );
        Test.stopTest();

        Assert.isTrue(records.isEmpty(), 'Expected no records for account without contacts');
    }

    @IsTest
    static void throwsOnInvalidObjectApiName() {
        try {
            RecordSelectorController.getRecordsByParent(
                'InvalidObject__x', 'AccountId', 'someId', 'Name', 'ASC'
            );
            Assert.fail('Expected AuraHandledException for invalid object');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('Invalid object'), 'Expected invalid object message');
        }
    }

    @IsTest
    static void throwsOnInvalidParentField() {
        try {
            RecordSelectorController.getRecordsByParent(
                'Contact', 'NonExistentField__x', 'someId', 'Name', 'ASC'
            );
            Assert.fail('Expected AuraHandledException for invalid parent field');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('Invalid parent field'), 'Expected invalid field message');
        }
    }

    @IsTest
    static void throwsOnInvalidLabelField() {
        try {
            RecordSelectorController.getRecordsByParent(
                'Contact', 'AccountId', 'someId', 'NonExistentField__x', 'ASC'
            );
            Assert.fail('Expected AuraHandledException for invalid label field');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('Invalid label field'), 'Expected invalid label field message');
        }
    }
}
