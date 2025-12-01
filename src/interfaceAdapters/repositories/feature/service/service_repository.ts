// import { injectable } from 'tsyringe'
// import {
//   ServiceModel,
//   IServiceModel,
// } from '../../../database/mongoDb/models/service_model'
// import { BaseRepository } from '../../base_repository'
// import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
// import { IServiceEntity } from '../../../../domain/models/service_entity'

// @injectable()
// export class ServiceRepository
//   extends BaseRepository<IServiceModel, IServiceEntity>
//   implements IServiceRepository
// {
//   constructor() {
//     super(ServiceModel)
//   }
//   protected toEntity(model: IServiceModel): IServiceEntity {
//     return {
//       _id: model._id.toString(),

//       vendorRef: model.vendorRef.toString(),
//       subServiceCategoryRef: model.subServiceCategoryRef.toString(),

//       title: model.title,
//       description: model.description,

//       pricing: {
//         pricePerSlot: model.pricing.pricePerSlot,
//         isAdvanceRequired: model.pricing.isAdvanceRequired,
//         advanceAmountPerSlot: model.pricing.advanceAmountPerSlot,
//         currency: model.pricing.currency,
//       },

//       images: model.images,

//       isActiveStatusByAdmin: model.isActiveStatusByAdmin,
//       isActiveStatusByVendor: model.isActiveStatusByVendor,
//       adminStatusNote: model.adminStatusNote,

//       schedule: {
//         visibilityStartDate: model.schedule.visibilityStartDate,
//         visibilityEndDate: model.schedule.visibilityEndDate,

//         workStartTime: model.schedule.workStartTime,
//         workEndTime: model.schedule.workEndTime,
//         slotDurationMinutes: model.schedule.slotDurationMinutes,

//         recurrenceType: model.schedule.recurrenceType,
//         weeklyWorkingDays: model.schedule.weeklyWorkingDays,
//         monthlyWorkingDates: model.schedule.monthlyWorkingDates,
//         holidayDates: model.schedule.holidayDates,
//       },

//       serviceHistoryRefs: model.serviceHistoryRefs.map((ref) => ref.toString()),

//       createdAt: model.createdAt,
//       updatedAt: model.updatedAt,
//     }
//   }
// }
