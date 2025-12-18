# Модуль KPI и отчетности

## Общие принципы

Модуль KPI и отчетности отвечает за сбор, анализ и визуализацию ключевых показателей эффективности проектов и технологий. Он обеспечивает автоматическое вычисление метрик, генерацию стандартных и пользовательских отчетов, а также экспорт данных в различные форматы для дальнейшего анализа и принятия решений.

## Архитектура модуля

### Структура каталогов

```
kpis/
├── domain/          // Бизнес-логика и сущности KPI
│   ├── entities/    // Сущности KPI и метрик
│   ├── interfaces/  // Интерфейсы репозиториев
│   └── services/   // Бизнес-логика
├── application/      // Сервисы и use-case'ы управления KPI
│   ├── dto/         // DTO для передачи данных
│   ├── use-cases/   // Сценарии использования
│   └── services/    // Сервисы приложения
├── infrastructure/  // Репозитории, DTO, внешние интерфейсы
│   ├── repositories/  // Реализации репозиториев
│   ├── persistence/ // Модели базы данных
│   └── mappers/      // Мапперы между слоями
└── interfaces/      // REST/GraphQL контроллеры и экспорт
    ├── rest/        // REST контроллеры
    ├── graphql/     // GraphQL резолверы
    └── export/      // Экспорт данных
```

## Доменная модель

### Сущности

#### KPI (Ключевой показатель эффективности)

Основная сущность модуля, представляющая KPI в системе.

```typescript
interface KPI {
  id: string;
  name: string;
  description: string;
  category: 'project' | 'technology' | 'portfolio' | 'resource';
  entityType: 'project' | 'technology' | 'user' | 'team';
  entityId: string;
  calculationMethod: 'manual' | 'automatic' | 'formula';
  formula: string; // Для автоматических KPI
  unit: string;
  targetValue: number;
  currentValue: number;
  threshold: number; // Пороговое значение для уведомлений
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastCalculated: Date;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
```

#### KPIValue (Значение KPI)

Исторические значения KPI во времени.

```typescript
interface KPIValue {
  id: string;
  kpiId: string;
  value: number;
  timestamp: Date;
  calculatedBy: User;
  source: string; // Источник данных
  comments: string;
}
```

#### KPIReport (Отчет по KPI)

Структура отчета по KPI.

```typescript
interface KPIReport {
  id: string;
  name: string;
  description: string;
  kpis: KPI[];
  filters: ReportFilter[];
  schedule: ReportSchedule;
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  recipients: string[]; // Email адреса получателей
  lastGenerated: Date;
  nextGeneration: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ReportFilter (Фильтр отчета)

Фильтры для настройки отчетов.

```typescript
interface ReportFilter {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'between';
  value: any;
  value2: any; // Для оператора 'between'
}
```

## Прикладные сервисы

### KPIService

Основной сервис для управления KPI.

#### Методы

- `createKPI(dto: CreateKPIDTO): Promise<KPI>` - Создание нового KPI
- `updateKPI(id: string, dto: UpdateKPIDTO): Promise<KPI>` - Обновление KPI
- `getKPI(id: string): Promise<KPI>` - Получение KPI по ID
- `getKPIs(filter: KPIFilter): Promise<KPI[]>` - Получение списка KPI
- `deleteKPI(id: string): Promise<void>` - Удаление KPI
- `calculateKPI(id: string): Promise<number>` - Расчет значения KPI
- `getKPIHistory(kpiId: string, filter: HistoryFilter): Promise<KPIValue[]>` - Получение истории значений KPI
- `getEntityKPIs(entityType: string, entityId: string): Promise<KPI[]>` - Получение KPI сущности

### KPIReportService

Сервис для управления отчетами.

#### Методы

- `createReport(dto: CreateReportDTO): Promise<KPIReport>` - Создание отчета
- `updateReport(id: string, dto: UpdateReportDTO): Promise<KPIReport>` - Обновление отчета
- `getReport(id: string): Promise<KPIReport>` - Получение отчета по ID
- `getReports(filter: ReportFilter): Promise<KPIReport[]>` - Получение списка отчетов
- `deleteReport(id: string): Promise<void>` - Удаление отчета
- `generateReport(id: string): Promise<ReportResult>` - Генерация отчета
- `scheduleReport(id: string, schedule: ReportSchedule): Promise<KPIReport>` - Планирование отчета
- `getScheduledReports(): Promise<KPIReport[]>` - Получение запланированных отчетов

### KPIExportService

Сервис для экспорта данных.

#### Методы

- `exportKPIs(kpiIds: string[], format: ExportFormat): Promise<ExportResult>` - Экспорт KPI
- `exportReport(reportId: string, format: ExportFormat): Promise<ExportResult>` - Экспорт отчета
- `exportEntityKPIs(entityType: string, entityId: string, format: ExportFormat): Promise<ExportResult>` - Экспорт KPI сущности
- `generateDashboard(entityType: string, entityId: string): Promise<DashboardResult>` - Генерация дашборда

### KPIMonitoringService

Сервис для мониторинга KPI.

#### Методы

- `checkThresholds(): Promise<Alert[]>` - Проверка пороговых значений
- `sendAlerts(alerts: Alert[]): Promise<void>` - Отправка уведомлений
- `generateInsights(): Promise<Insight[]>` - Генерация инсайтов
- `calculateTrends(kpiId: string, period: number): Promise<Trend[]>` - Расчет трендов
- `performKPIAnalysis(kpiId: string): Promise<KPIAnalysis>` - Анализ KPI

## Use-case'ы

### Создание KPI

1. Валидация входных данных
2. Создание новой сущности KPI
3. Проверка формулы для автоматических KPI
4. Установка начальных значений
5. Назначение категории и сущности
6. Сохранение KPI в репозитории
7. Логирование события создания

### Расчет KPI

1. Проверка необходимости пересчета (по расписанию или по запросу)
2. Получение необходимых данных из других модулей
3. Выполнение расчета по формуле или агрегация данных
4. Сохранение результата в истории значений
5. Обновление текущего значения KPI
6. Проверка достижения пороговых значений
7. Логирование результата расчета

### Генерация отчета

1. Получение параметров отчета
2. Применение фильтров к данным
3. Агрегация данных по заданным критериям
4. Формирование структуры отчета
5. Преобразование данных в требуемый формат
6. Сохранение результата или отправка получателям
7. Логирование генерации отчета

### Мониторинг KPI

1. По расписанию проверять все активные KPI
2. Сравнивать текущие значения с пороговыми
3. Генерировать уведомления при превышении порогов
4. Анализировать тренды и генерировать инсайты
5. Отправлять уведомления заинтересованным сторонам
6. Логировать результаты мониторинга

### Экспорт данных

1. Получение запроса на экспорт
2. Выборка данных по критериям
3. Преобразование данных в требуемый формат
4. Генерация файла экспорта
5. Предоставление ссылки на скачивание или отправка по email
6. Логирование операции экспорта

## Интерфейсы

### REST API

#### Основные endpoints

- `POST /api/v1/kpis` - Создание KPI
- `GET /api/v1/kpis` - Получение списка KPI
- `GET /api/v1/kpis/{id}` - Получение KPI
- `PUT /api/v1/kpis/{id}` - Обновление KPI
- `DELETE /api/v1/kpis/{id}` - Удаление KPI
- `POST /api/v1/kpis/{id}/calculate` - Расчет значения KPI
- `GET /api/v1/kpis/{id}/history` - Получение истории значений KPI
- `GET /api/v1/kpis/entity/{type}/{id}` - Получение KPI сущности
- `POST /api/v1/reports` - Создание отчета
- `GET /api/v1/reports` - Получение списка отчетов
- `GET /api/v1/reports/{id}` - Получение отчета
- `PUT /api/v1/reports/{id}` - Обновление отчета
- `DELETE /api/v1/reports/{id}` - Удаление отчета
- `POST /api/v1/reports/{id}/generate` - Генерация отчета
- `POST /api/v1/reports/{id}/schedule` - Планирование отчета
- `POST /api/v1/export/kpis` - Экспорт KPI
- `POST /api/v1/export/reports/{id}` - Экспорт отчета
- `GET /api/v1/insights` - Получение инсайтов

#### DTO

```typescript
// DTO для создания KPI
interface CreateKPIDTO {
  name: string;
  description: string;
  category: 'project' | 'technology' | 'portfolio' | 'resource';
  entityType: 'project' | 'technology' | 'user' | 'team';
  entityId: string;
  calculationMethod: 'manual' | 'automatic' | 'formula';
  formula: string;
  unit: string;
  targetValue: number;
  threshold: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  tags: string[];
}

// DTO для обновления KPI
interface UpdateKPIDTO {
  name?: string;
  description?: string;
  calculationMethod?: 'manual' | 'automatic' | 'formula';
  formula?: string;
  unit?: string;
  targetValue?: number;
  threshold?: number;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  isActive?: boolean;
  tags?: string[];
}

// DTO для создания отчета
interface CreateReportDTO {
  name: string;
  description: string;
  kpiIds: string[];
  filters: ReportFilter[];
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  recipients: string[];
}

// DTO для планирования отчета
interface ScheduleReportDTO {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string; // Время в формате HH:MM
  dayOfWeek?: number; // Для еженедельных отчетов (0-6)
  dayOfMonth?: number; // Для ежемесячных отчетов (1-31)
}
```

### GraphQL

#### Типы

```graphql
type KPI {
  id: ID!
  name: String!
  description: String
  category: KPICategory!
  entityType: EntityType!
  entityId: ID!
  calculationMethod: CalculationMethod!
  formula: String
  unit: String!
  targetValue: Float
  currentValue: Float
  threshold: Float
  frequency: KPIFrequency!
  lastCalculated: DateTime
  isActive: Boolean!
  tags: [String!]!
  history: [KPIValue!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum KPICategory {
  PROJECT
  TECHNOLOGY
  PORTFOLIO
  RESOURCE
}

enum EntityType {
  PROJECT
  TECHNOLOGY
  USER
  TEAM
}

enum CalculationMethod {
  MANUAL
  AUTOMATIC
  FORMULA
}

enum KPIFrequency {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
}

type KPIValue {
  id: ID!
  kpi: KPI!
  value: Float!
  timestamp: DateTime!
  calculatedBy: User
  source: String
  comments: String
}

type KPIReport {
  id: ID!
  name: String!
  description: String
  kpis: [KPI!]!
  filters: [ReportFilter!]!
  schedule: ReportSchedule
  format: ReportFormat!
  recipients: [String!]!
  lastGenerated: DateTime
  nextGeneration: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ReportFilter {
  field: String!
  operator: FilterOperator!
  value: String
  value2: String
}

enum FilterOperator {
  EQUALS
  NOT_EQUALS
  GREATER_THAN
  LESS_THAN
  CONTAINS
  BETWEEN
}

type ReportSchedule {
  frequency: ReportFrequency!
  time: String!
  dayOfWeek: Int
  dayOfMonth: Int
}

enum ReportFrequency {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
}

enum ReportFormat {
  PDF
  EXCEL
  CSV
  JSON
  HTML
}

type Insight {
  id: ID!
  title: String!
  description: String!
  severity: InsightSeverity!
  relatedKPIs: [KPI!]!
  createdAt: DateTime!
}

enum InsightSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

type Trend {
  kpi: KPI!
  direction: TrendDirection!
  value: Float!
  period: Int!
}

enum TrendDirection {
  UP
  DOWN
  STABLE
}

type Dashboard {
  id: ID!
  name: String!
  kpis: [KPI!]!
  widgets: [Widget!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Widget {
  id: ID!
  type: WidgetType!
  title: String!
  kpiId: ID!
  configuration: JSON
}

enum WidgetType {
  CHART
  GAUGE
  TABLE
  METRIC
}
```

#### Запросы

```graphql
type Query {
  kpis(filter: KPIFilter): [KPI!]!
  kpi(id: ID!): KPI
  kpiHistory(kpiId: ID!, filter: HistoryFilter): [KPIValue!]!
  entityKPIs(entityType: EntityType!, entityId: ID!): [KPI!]!
  reports(filter: ReportFilter): [KPIReport!]!
  report(id: ID!): KPIReport
  insights: [Insight!]!
  trends(kpiId: ID!, period: Int!): [Trend!]!
  dashboard(entityType: EntityType!, entityId: ID!): Dashboard
}

type Mutation {
  createKPI(input: CreateKPIInput!): KPI!
  updateKPI(id: ID!, input: UpdateKPIInput!): KPI!
  calculateKPI(id: ID!): KPI!
  createReport(input: CreateReportInput!): KPIReport!
  updateReport(id: ID!, input: UpdateReportInput!): KPIReport!
  generateReport(id: ID!): ReportResult!
  scheduleReport(id: ID!, input: ScheduleReportInput!): KPIReport!
  exportKPIs(input: ExportKPIsInput!): ExportResult!
  exportReport(id: ID!, format: ReportFormat!): ExportResult!
}
```

## Интеграции

### Входящие интеграции

- Системы учета времени для получения данных о трудозатратах
- Финансовые системы для получения данных о бюджете и расходах
- Системы мониторинга для получения технических метрик
- Внешние источники данных (биржи, индексы и т.д.)

### Исходящие интеграции

- Уведомления в Slack/MS Teams о достижении KPI
- Email уведомления о превышении порогов
- Вебхуки для внешних систем отчетности
- BI системы для дальнейшего анализа
- Системы автоматизации для триггеров на основе KPI

## Бизнес-правила

### Правила расчета KPI

- Автоматические KPI пересчитываются по расписанию
- Ручные KPI обновляются через API или интерфейс
- Формульные KPI вычисляются на основе других KPI
- При отсутствии данных значение KPI становится null

### Правила уведомлений

- При достижении порогового значения отправляется уведомление
- При отклонении от цели более чем на 10% отправляется предупреждение
- Еженедельный дайджест KPI отправляется менеджерам
- Критические отклонения уведомляются немедленно

### Правила отчетности

- Отчеты генерируются по расписанию или по запросу
- Экспорт данных доступен в форматах CSV, Excel, PDF, JSON
- Дашборды обновляются в реальном времени
- История отчетов сохраняется в течение 2 лет

### Правила доступа

- Доступ к KPI ограничен по принадлежности к сущности
- Отчеты могут быть общедоступными или ограниченными
- Экспорт данных доступен только авторизованным пользователям
- Аудит всех операций с KPI ведется в системе

## Отчетность

### Стандартные отчеты

- Дашборд портфеля (KPI по всем проектам)
- Отчет по проекту (KPI конкретного проекта)
- Отчет по технологиям (KPI по технологическому стеку)
- Отчет по ресурсам (KPI по загрузке ресурсов)
- Отчет по бюджету (KPI по финансовым показателям)
- Отчет по качеству (KPI по качеству deliverables)

### Экспорт отчетов

- CSV для импорта в Excel и другие системы анализа
- Excel с форматированием и диаграммами
- PDF для печати и архивирования
- JSON для интеграции с другими системами
- HTML для веб-публикации

## Аудит и логирование

### События аудита

- Создание KPI
- Изменение параметров KPI
- Расчет значений KPI
- Создание отчетов
- Генерация отчетов
- Экспорт данных
- Уведомления по KPI

### Логирование

- Все операции с KPI логируются с указанием пользователя
- Логи доступны через API аудита
- Логи экспортируются для архивирования
- Логи включают историю изменений всех параметров KPI
- Производительность расчетов KPI также логируется
