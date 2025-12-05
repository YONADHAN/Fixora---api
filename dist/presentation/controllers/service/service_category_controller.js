'use strict'
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc)
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
    return (c > 3 && r && Object.defineProperty(target, key, r), r)
  }
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v)
  }
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex)
    }
  }
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.ServiceCategoryController = void 0
const tsyringe_1 = require('tsyringe')
const error_handler_1 = require('../../../shared/utils/error_handler')
const constants_1 = require('../../../shared/constants')
let ServiceCategoryController = class ServiceCategoryController {
  constructor(
    _getAllServiceCategoryUseCase,
    _createServiceCategoryUseCase,
    _editServiceCategoryUseCase,
    _blockServiceCategoryUseCase,
    _getSingleServiceCategoryUseCase
  ) {
    this._getAllServiceCategoryUseCase = _getAllServiceCategoryUseCase
    this._createServiceCategoryUseCase = _createServiceCategoryUseCase
    this._editServiceCategoryUseCase = _editServiceCategoryUseCase
    this._blockServiceCategoryUseCase = _blockServiceCategoryUseCase
    this._getSingleServiceCategoryUseCase = _getSingleServiceCategoryUseCase
  }
  getAllServiceCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { page, limit, search } = req.query
        const response = yield this._getAllServiceCategoryUseCase.execute({
          page: Number(page),
          limit: Number(limit),
          search,
        })
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, response })
      } catch (error) {
        ;(0, error_handler_1.handleErrorResponse)(req, res, error)
      }
    })
  }
  createServiceCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, description } = req.body
        const bannerImage = req.file
        //console.log('The create service category', name, description);
        // if (bannerImage) {
        //     console.log('banner image also got');
        // }
        yield this._createServiceCategoryUseCase.execute({
          name,
          description,
          bannerImage,
        })
        res.status(constants_1.HTTP_STATUS.OK).json({
          message:
            constants_1.SUCCESS_MESSAGES.SERVICE_CATGORIES_CREATED_SUCCESSFULLY,
        })
      } catch (error) {
        ;(0, error_handler_1.handleErrorResponse)(req, res, error)
      }
    })
  }
  editServiceCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { categoryId, name, description } = req.body
        const bannerImage = req.file
        yield this._editServiceCategoryUseCase.execute(
          categoryId,
          name,
          description,
          bannerImage
        )
        res.status(200).json({
          success: true,
          message:
            constants_1.SUCCESS_MESSAGES.SERVICE_CATEGORIES_EDITED_SUCCESSFULLY,
        })
      } catch (error) {
        ;(0, error_handler_1.handleErrorResponse)(req, res, error)
      }
    })
  }
  blockServiceCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { categoryId, status } = req.body
        yield this._blockServiceCategoryUseCase.execute(categoryId, status)
        res
          .status(constants_1.HTTP_STATUS.OK)
          .json({
            message: constants_1.SUCCESS_MESSAGES.SERVICE_BLOCKED_SUCCESSFULLY,
          })
      } catch (error) {
        ;(0, error_handler_1.handleErrorResponse)(req, res, error)
      }
    })
  }
  getSingleServiceCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { categoryId } = req.params
        const category = yield this._getSingleServiceCategoryUseCase.execute({
          categoryId,
        })
        if (!category) {
          res
            .status(constants_1.HTTP_STATUS.NOT_FOUND)
            .json({ success: false, message: 'Category not found' })
          return
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
          success: true,
          data: category,
        })
      } catch (error) {
        ;(0, error_handler_1.handleErrorResponse)(req, res, error)
      }
    })
  }
}
exports.ServiceCategoryController = ServiceCategoryController
exports.ServiceCategoryController = ServiceCategoryController = __decorate(
  [
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('IGetAllServiceCategoryUseCase')),
    __param(1, (0, tsyringe_1.inject)('ICreateServiceCategoryUseCase')),
    __param(2, (0, tsyringe_1.inject)('IEditServiceCategoryUseCase')),
    __param(3, (0, tsyringe_1.inject)('IBlockServiceCategoryUseCase')),
    __param(4, (0, tsyringe_1.inject)('IGetSingleServiceCategoryUseCase')),
    __metadata('design:paramtypes', [Object, Object, Object, Object, Object]),
  ],
  ServiceCategoryController
)
