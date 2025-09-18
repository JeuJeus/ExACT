const { sanityCheck } = require('./server');

test('sanityCheck should pass when all senderReceiverEntities are in entities', () => {
    process.env.SENDER_RECEIVER_ENTITIES = 'entity1,entity2';
    process.env.ENTITIES = 'entity1,entity2,entity3';
    const senderReceiverEntities = process.env.SENDER_RECEIVER_ENTITIES.split(',');
    const entities = process.env.ENTITIES.split(',');

    expect(() => sanityCheck(senderReceiverEntities, entities)).not.toThrow();
});

test('sanityCheck should fail when a senderReceiverEntity is not in entities', () => {
    process.env.SENDER_RECEIVER_ENTITIES = 'entity1,entity2';
    process.env.ENTITIES = 'entity1,entity3';
    const senderReceiverEntities = process.env.SENDER_RECEIVER_ENTITIES.split(',');
    const entities = process.env.ENTITIES.split(',');

    const originalExit = process.exit;
    process.exit = jest.fn();

    sanityCheck(senderReceiverEntities, entities);

    expect(process.exit).toHaveBeenCalledWith(1);

    process.exit = originalExit;
});