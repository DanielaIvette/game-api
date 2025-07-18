import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Game } from "./game.entity";
import { User } from "src/users/entities/user.entity";

    @Table({
    tableName: 'games_players',
    timestamps: true,
})
export class GamePlayer extends Model {
    @ForeignKey(() => Game)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
})
    gameId: number;

    @ForeignKey(() => User)
    @Column ({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

     @Column({
    type: DataType.ENUM('waiting', 'in_progress', 'finished'),
    defaultValue: 'waiting',
  })
  status: 'waiting' | 'in_progress' | 'finished';

  @BelongsTo(() => Game)
  game: Game;

  @BelongsTo(() => User)
  user: User;

}
