import type { Schema, Struct } from '@strapi/strapi';

export interface CustomerDataCustomerData extends Struct.ComponentSchema {
  collectionName: 'components_customer_data_customer_data';
  info: {
    displayName: 'customer_data';
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    postal_code: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'customer-data.customer-data': CustomerDataCustomerData;
    }
  }
}
