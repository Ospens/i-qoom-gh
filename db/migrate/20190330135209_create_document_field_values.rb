class CreateDocumentFieldValues < ActiveRecord::Migration[5.2]
  def change
    create_table :document_field_values do |t|
      t.references :document_field, foreign_key: true
      t.string :value
      t.string :title
      t.integer :position

      t.timestamps
    end
  end
end