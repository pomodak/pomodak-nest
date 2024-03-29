import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ItemInventoryEntity } from './item-inventory.entity';
import { Item } from '../domain/item';

@Entity({
  name: 'item',
})
export class ItemEntity extends CommonEntity implements Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column()
  @IsString()
  item_type: string; // Food, Consumable

  @Column()
  @IsString()
  description: string;

  @Column({ type: 'int', nullable: true })
  @IsNumber()
  required_study_time: number | null;

  @Column()
  @IsNumber()
  cost: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsString()
  grade: string | null;

  @Column()
  @IsString()
  image_url: string;

  @Column()
  @IsNumber()
  effect_code: number; // 음식사용(10000번대), 사용아이템(20000번대)

  @Column({ type: 'boolean' })
  @IsBoolean()
  is_hidden: boolean; // 상점에 보이는 여부

  @OneToMany(
    () => ItemInventoryEntity,
    (itemInventory) => itemInventory.item_inventory_id,
  )
  item_inventories?: ItemInventoryEntity[];
}
