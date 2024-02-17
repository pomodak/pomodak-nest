import { IsNumber, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { CharacterInventory } from './character-inventory.entity';
import { StudyCategory } from './study-category.entity';
import { TransactionRecord } from './transaction-record.entity';
import { StudyStreak } from './study-streak.entity';
import { ItemInventory } from './item-inventory.entity';
import { StudyRecord } from './study-record.entity';
import { Account } from './account.entity';

@Entity()
export class Member extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  member_id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @IsString()
  image_url: string | null;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  role: string;

  @Column({
    nullable: true,
    type: 'bigint',
  })
  @IsNumber()
  active_record_id: number | null;

  @Column({
    default: 0,
  })
  @IsNumber()
  point: number;

  @OneToMany(
    () => CharacterInventory,
    (characterInventory) => characterInventory.member,
  )
  character_inventories: CharacterInventory[];

  @OneToMany(() => ItemInventory, (eggInventory) => eggInventory.member)
  item_inventories: ItemInventory[];

  @OneToMany(() => StudyCategory, (studyCategory) => studyCategory.member)
  study_categories: StudyCategory[];

  @OneToMany(() => StudyRecord, (studyRecord) => studyRecord.member)
  study_records: StudyRecord[];

  @OneToMany(
    () => TransactionRecord,
    (transactionRecord) => transactionRecord.member,
  )
  transaction_records: TransactionRecord[];

  @OneToOne(() => StudyStreak, (studyStreak) => studyStreak.member, {})
  @JoinColumn({ name: 'study_streak_id' })
  study_streak: StudyStreak;

  @OneToOne(() => Account, (account) => account.member, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
