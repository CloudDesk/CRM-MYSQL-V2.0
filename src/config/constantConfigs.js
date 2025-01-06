import { appConfig } from "./appConfig";

export const ACCOUNT_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.account.apiName,
  ROUTES: {
    ACCOUNTS: appConfig.objects.account.base,
    DELETE_ACCOUNT: appConfig.objects.account.delete,
    NEW_ACCOUNT: appConfig.objects.account.new,
    ACCOUNT_DETAIL: appConfig.objects.account.detail,
    UPSERT: appConfig.objects.account.upsert,
  },
  TITLES: {
    MAIN: appConfig.objects.account.apiName,
    WEB_SUBTITLE: `List Of ${appConfig.objects.account.name.plural}`,
    MOBILE_SUBTITLE: `List of ${appConfig.objects.account.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some accounts failed to delete",
    DELETE_SINGLE: "Failed to delete account",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All accounts deleted successfully",
    DELETE_SINGLE: "Account deleted successfully",
  },
};

export const CONTACT_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.contact.apiName,
  ROUTES: {
    CONTACTS: appConfig.objects.contact.base,
    DELETE_CONTACT: appConfig.objects.contact.delete,
    NEW_CONTACT: appConfig.objects.contact.new,
    CONTACT_DETAIL: appConfig.objects.contact.detail,
  },
  TITLES: {
    MAIN: appConfig.objects.contact.apiName,
    WEB_SUBTITLE: `List Of ${appConfig.objects.contact.name.plural}`,
    MOBILE_SUBTITLE: `List of  ${appConfig.objects.contact.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some contacts failed to delete",
    DELETE_SINGLE: "Failed to delete contact",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All contacts deleted successfully",
    DELETE_SINGLE: "Contact deleted successfully",
  },
  IMPORT_CONFIG: {
    objectName: "Contact",
    isImport: false,
    callBack: null,
  },
};

export const INVENTORY_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.inventory.apiName,
  ROUTES: {
    INVENTORY: appConfig.objects.inventory.base,
    DELETE_INVENTORY: appConfig.objects.inventory.delete || "/deleteInventory",
    NEW_INVENTORY: appConfig.objects.inventory.new || "/inventories/new",
    INVENTORY_DETAIL: appConfig.objects.inventory.detail || "/inventories",
  },
  TITLES: {
    MAIN: appConfig.objects.inventory.apiName,
    WEB_SUBTITLE: `List Of ${appConfig.objects.inventory.name.plural}`,
    MOBILE_SUBTITLE: `List Of ${appConfig.objects.inventory.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some records failed to delete",
    DELETE_SINGLE: "Failed to delete record",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All records deleted successfully",
    DELETE_SINGLE: "Record deleted successfully",
  },
  IMPORT_CONFIG: {
    objectName: appConfig.objects.account.name,
    isImport: false,
    callBack: null,
  },
};

export const LEAD_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.lead.apiName,
  ROUTES: {
    LEADS: appConfig.objects.lead.base,
    DELETE_LEAD: appConfig.objects.lead.delete,
    NEW_LEAD: appConfig.objects.lead.new,
    LEAD_DETAIL: appConfig.objects.lead.detail,
  },
  TITLES: {
    MAIN: appConfig.objects.lead.apiName,
    WEB_SUBTITLE: `List Of ${appConfig.objects.lead.name.plural}`,
    MOBILE_SUBTITLE: `List of ${appConfig.objects.lead.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some records failed to delete",
    DELETE_SINGLE: "Failed to delete record",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All records deleted successfully",
    DELETE_SINGLE: "Record deleted successfully",
  },
};

export const OPPORTUNITY_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.opportunity.apiName,
  ROUTES: {
    OPPORTUNITIES: appConfig.objects.opportunity.base || "/opportunities",
    DELETE_OPPORTUNITY:
      appConfig.objects.opportunity.delete || "/deleteOpportunity",
    NEW_OPPORTUNITY: appConfig.objects.opportunity.new || "/deals/new",
    OPPORTUNITY_DETAIL: appConfig.objects.opportunity.detail || "/deals",
  },
  TITLES: {
    MAIN: appConfig.objects.opportunity.name.singular,
    WEB_SUBTITLE: `List Of ${appConfig.objects.opportunity.name.plural} `,
    MOBILE_SUBTITLE: `List Of ${appConfig.objects.opportunity.name.plural} `,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some dealRecords failed to delete",
    DELETE_SINGLE: "Failed to delete record",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All dealRecords deleted successfully",
    DELETE_SINGLE: "Record deleted successfully",
  },
};

export const PERMISSION_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.permission.apiName,
  ROUTES: {
    PERMISSIONS: appConfig.objects.permission.base || "/getPermissions",
    DELETE_PERMISSION:
      appConfig.objects.permission.delete || "/deletePermission",
    NEW_PERMISSION: appConfig.objects.permission.new || "/permissions/new",
    PERMISSION_DETAIL: appConfig.objects.permission.detail || "/permissions",
  },
  TITLES: {
    MAIN: appConfig.objects.permission.name.singular,
    WEB_SUBTITLE: `List Of ${appConfig.objects.permission.name.plural}`,
    MOBILE_SUBTITLE: `List Of ${appConfig.objects.permission.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some permissions failed to delete",
    DELETE_SINGLE: "Failed to delete permission",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All permissions deleted successfully",
    DELETE_SINGLE: "Permission deleted successfully",
  },
  IMPORT_CONFIG: {
    objectName: appConfig.objects.permission.apiName,
    isImport: false,
    callBack: null,
  },
};

export const TASK_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.task.apiName,
  ROUTES: {
    TASK: appConfig.objects.task.base || "/Task",
    DELETE_TASK: appConfig.objects.task.delete || "/deleteTask",
    NEW_TASK: appConfig.objects.task.new || "/events/new",
    TASK_DETAIL: appConfig.objects.task.detail || "/events",
  },
  TITLES: {
    MAIN: appConfig.objects.task.name.singular,
    WEB_SUBTITLE: `List Of ${appConfig.objects.task.name.plural}`,
    MOBILE_SUBTITLE: `List Of ${appConfig.objects.task.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some tasks failed to delete",
    DELETE_SINGLE: "Failed to delete task",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All tasks deleted successfully",
    DELETE_SINGLE: "Task deleted successfully",
  },
  IMPORT_CONFIG: {
    objectName: appConfig.objects.task.apiName,
    isImport: false,
    callBack: null,
  },
};

export const USER_CONSTANTS = {
  OBJECT_NAME: appConfig.objects.user.apiName,
  ROUTES: {
    USERS: appConfig.objects.user.base || "/Users",
    DELETE_USER: appConfig.objects.user.delete || "/delete",
    NEW_USER: appConfig.objects.user.new || "/users/new",
    USER_DETAIL: appConfig.objects.user.detail || "/users",
  },
  TITLES: {
    MAIN: appConfig.objects.user.name.singular,
    WEB_SUBTITLE: `List Of ${appConfig.objects.user.name.plural}`,
    MOBILE_SUBTITLE: `List Of ${appConfig.objects.user.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: "Some users failed to delete",
    DELETE_SINGLE: "Failed to delete user",
    DEFAULT: "An error occurred",
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: "All users deleted successfully",
    DELETE_SINGLE: "User deleted successfully",
  },
  IMPORT_CONFIG: {
    objectName: appConfig.objects.user.apiName,
    isImport: false,
    callBack: null,
  },
};

export const DATALOADER_CONSTANTS = {
  ROUTES: {
    preview: appConfig.api.dataLoader.preview,
    upsert: appConfig.api.dataLoader.upsert,
    upsertLead: appConfig.api.dataLoader.upsertLead,
    upsertAccount: appConfig.api.dataLoader.upsertAccount,
    upsertOpportunity: appConfig.api.dataLoader.upsertOpportunity,
  },
};
