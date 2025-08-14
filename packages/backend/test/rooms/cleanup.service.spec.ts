import { Test } from '@nestjs/testing';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { INestApplicationContext } from '@nestjs/common';
import { CleanupService } from '../../src/rooms/cleanup.service';
import { RoomsService } from '../../src/rooms/rooms.service';

describe('CleanupService (@Interval 30s)', () => {
  let app: INestApplicationContext;
  let roomsService: { deleteStales: jest.Mock };

  beforeAll(async () => {
    // Usar timers "modern" para advanceTimersByTimeAsync
    jest.useFakeTimers();

    roomsService = { deleteStales: jest.fn().mockResolvedValue(undefined) };

    const moduleRef = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [
        CleanupService,
        { provide: RoomsService, useValue: roomsService },
      ],
    }).compile();

    // Contexto liviano (no levanta HTTP)
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    jest.useRealTimers();
  });

  it('registra el intervalo con el nombre "cleanup"', () => {
    const registry = app.get(SchedulerRegistry);
    const timer = registry.getInterval('cleanup') as NodeJS.Timeout; // nombre del @Interval('cleanup', ...)
    expect(timer).toBeDefined();
  });

  it('ejecuta deleteStales cada 30s', async () => {
    roomsService.deleteStales.mockClear();

    expect(roomsService.deleteStales).toHaveBeenCalledTimes(0);

    // 90s => 3 ticks
    await jest.advanceTimersByTimeAsync(90_000);

    expect(roomsService.deleteStales).toHaveBeenCalledTimes(3);
  });

  it('no se solapa si una ejecución sigue corriendo (isRunning guard)', async () => {
    roomsService.deleteStales.mockReset();

    // Primera ejecución: promesa pendiente para simular tarea larga
    let resolve!: () => void;
    roomsService.deleteStales.mockReturnValueOnce(
      new Promise<void>((r) => (resolve = r)),
    );

    // Tick 1: arranca y queda ejecutándose
    await jest.advanceTimersByTimeAsync(30_000);
    expect(roomsService.deleteStales).toHaveBeenCalledTimes(1);

    // Avanzan 3 ticks más (90s) mientras sigue pendiente → no debería invocar de nuevo
    await jest.advanceTimersByTimeAsync(90_000);
    expect(roomsService.deleteStales).toHaveBeenCalledTimes(1);

    // Termina la ejecución larga
    resolve();
    // Deja que se resuelvan microtareas
    await Promise.resolve();

    // Próximo tick después de liberar el lock → vuelve a ejecutar
    await jest.advanceTimersByTimeAsync(30_000);
    expect(roomsService.deleteStales).toHaveBeenCalledTimes(2);
  });
});
