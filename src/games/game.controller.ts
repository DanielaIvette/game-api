import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
    constructor(private readonly gamesService: GameService) {}

    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gamesService.create(createGameDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gamesService.findOne(+id);
    }

@Patch(':id/join')
joinGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
  return this.gamesService.joinGame(+id, updateGameDto);
}

@Patch(':id/start')
startGame(@Param('id') id: string) {
return this.gamesService.startGame(+id);
}


@Patch(':id/end')
endGame (@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
return this.gamesService.endGame(+id, updateGameDto);
}
}
