import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('secure_id').unique()
      table.string('name').notNullable().unique()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.string('access_profile').notNullable().defaultTo('user')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
