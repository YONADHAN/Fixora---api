"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const otp_repository_1 = require("../../interfaceAdapters/repositories/auth/otp_repository");
const customer_repository_1 = require("../../interfaceAdapters/repositories/users/customer_repository");
const admin_repository_1 = require("../../interfaceAdapters/repositories/users/admin_repository");
const vendor_repository_1 = require("../../interfaceAdapters/repositories/users/vendor_repository");
const refresh_token_repositories_1 = require("../../interfaceAdapters/repositories/auth/refresh_token_repositories");
const redis_token_repository_1 = require("../../interfaceAdapters/repositories/redis/redis_token_repository");
const service_category_repository_1 = require("../../interfaceAdapters/repositories/feature/service/service_category_repository");
class RepositoryRegistry {
    static registerRepositories() {
        tsyringe_1.container.register('IOtpRepository', {
            useClass: otp_repository_1.OtpRepository,
        });
        tsyringe_1.container.register('ICustomerRepository', {
            useClass: customer_repository_1.CustomerRepository,
        });
        tsyringe_1.container.register('IAdminRepository', {
            useClass: admin_repository_1.AdminRepository,
        });
        tsyringe_1.container.register('IVendorRepository', {
            useClass: vendor_repository_1.VendorRepository,
        });
        tsyringe_1.container.register('IRefreshTokenRepository', {
            useClass: refresh_token_repositories_1.RefreshTokenRepository,
        });
        tsyringe_1.container.register('IRedisTokenRepository', {
            useClass: redis_token_repository_1.RedisTokenRepository,
        });
        tsyringe_1.container.register('IServiceCategoryRepository', {
            useClass: service_category_repository_1.ServiceCategoryRepository,
        });
    }
}
exports.RepositoryRegistry = RepositoryRegistry;
