import {
  UnseenVestingContract,
  CreateScheduleEntity,
  BatchMetadataUpdateEntity,
  MetadataUpdateEntity,
} from "generated";

UnseenVestingContract.CreateSchedule.loader(({ event, context }) => {
  let scheduleId = event.params.scheduleId;
  event.params.segments.forEach((segment, i) => {
    context.Segment.load(scheduleId + String(i), undefined);
  });

  const rangeId = scheduleId.toString();
  context.Range.load(rangeId);
});

UnseenVestingContract.CreateSchedule.handler(({ event, context }) => {
  let scheduleId = event.params.scheduleId;
  event.params.segments.forEach((segment, i) => {
    context.Segment.set({
      id: scheduleId + String(i),
      amount: segment[0],
      exponent: segment[1],
      milestone: segment[2],
      schedule_id: scheduleId.toString(),
    });
  });

  let range = event.params.range;
  const rangeId = scheduleId.toString();
  context.Range.set({
    id: rangeId,
    start: range[0],
    end: range[1],
  });

  const rangeEntity = context.Range.get(rangeId);

  const createScheduleEntity: CreateScheduleEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    scheduleId: scheduleId,
    funder: event.params.funder,
    sender: event.params.sender,
    recipient: event.params.recipient,
    amounts: event.params.amounts,
    cancelable: event.params.cancelable,
    transferable: event.params.transferable,
    range_id: rangeEntity?.id!,
  };

  context.CreateSchedule.set(createScheduleEntity);
});

UnseenVestingContract.BatchMetadataUpdate.loader(({ event, context }) => {
  context.BatchMetadataUpdate.load(
    event.transactionHash + event.logIndex.toString()
  );
});

UnseenVestingContract.BatchMetadataUpdate.handler(({ event, context }) => {
  const batchMetadataUpdateEntity: BatchMetadataUpdateEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    _fromTokenId: event.params.fromTokenId,
    _toTokenId: event.params.toTokenId,
  };

  context.BatchMetadataUpdate.set(batchMetadataUpdateEntity);
});

UnseenVestingContract.MetadataUpdate.loader(({ event, context }) => {
  context.MetadataUpdate.load(
    event.transactionHash + event.logIndex.toString()
  );
});

UnseenVestingContract.MetadataUpdate.handler(({ event, context }) => {
  const metadataUpdateEntity: MetadataUpdateEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    _tokenId: event.params.tokenId,
  };

  context.MetadataUpdate.set(metadataUpdateEntity);
});
