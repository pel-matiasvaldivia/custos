import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly ruta = '/dashboard';
}

export class CuadrantePage extends BasePage {
  readonly ruta = '/quadrant';

  readonly generarMes = this.boton(/Generar Mes/i);
  readonly exportar = this.boton(/Exportar/i);
}

export class NovedadesPage extends BasePage {
  readonly ruta = '/novedades';
}

export class MonitoreoPage extends BasePage {
  readonly ruta = '/monitoring';
}

export class LiquidacionesPage extends BasePage {
  readonly ruta = '/liquidaciones';
}

export class ObjetivosPage extends BasePage {
  readonly ruta = '/objectives';
}

export class ReportesPage extends BasePage {
  readonly ruta = '/reports';
}

export class ConfiguracionPage extends BasePage {
  readonly ruta = '/settings';
}
