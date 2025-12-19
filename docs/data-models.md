# Модели данных и интерфейсы

## Общие принципы

Все сущности системы следуют следующим принципам:
- Неизменяемый уникальный идентификатор (ID)
- Версионирование через `updatedAt`
- Строгая валидация данных
- Поддержка метаданных (временные метки, источник данных)

## Базовые интерфейсы

```typescript
// Базовый интерфейс для всех сущностей
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// Интерфейс для сущностей с метаданными
interface Metadata {
  source: string; // Источник данных (Jira, CSV, API и т.д.)
  createdAt: Date;
  updatedAt: Date;
}

// Базовый интерфейс для пользователей
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'portfolio_manager' | 'project_manager' | 'viewer';
}
```

## Модель проекта (Project)

```typescript
interface Project extends BaseEntity {
  name: string;
  description: string;
  businessGoals: string[];
  owner: User;
  team: User[];
  status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  phase: 'planning' | 'development' | 'testing' | 'release';
  timeline: {
    start: Date;
    end: Date;
    actualEnd?: Date;
  };
  budget: number; // Утвержденный бюджет
  spent: number;   // Фактические расходы
  forecast: number; // Прогнозируемые расходы
  kpis: KPI[];
  technologies: Technology[];
  tasks: Task[];
  risks: Risk[];
  metadata: Metadata;
}
```

## Модель технологии (Technology)

```typescript
interface Technology extends BaseEntity {
  name: string;
  category: string; // 'frontend', 'database', 'ci/cd' и т.д.
  version: string;
  lifecycleStage: 'selection' | 'deployment' | 'operation' | 'deprecation' | 'retired';
  owningArchitect: User;
  projects: Project[];
  metadata: Metadata;
}
```

## Модель задачи (Task)

```typescript
interface Task extends BaseEntity {
  title: string;
  description?: string;
  assignee: User;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  projectId: string;
  dependencies: string[]; // ID зависимых задач
  metadata: Metadata;
}
```

## Модель риска (Risk)

```typescript
interface Risk extends BaseEntity {
  description: string;
  probability: number; // 0-1
  impact: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical'; // Автоматически рассчитывается
  mitigationPlan: string;
  owner: User;
  linkedTo: {
    type: 'project' | 'task';
    id: string;
  };
  status: 'open' | 'mitigated' | 'closed';
}
```

## Модель KPI

```typescript
interface KPI extends BaseEntity {
  name: string;
  value: number;
  target: number;
  unit: string;
  entityType: 'project' | 'technology';
  entityId: string;
  timestamp: Date;
}
```

## Интерфейсы для управления доступом

```typescript
// Роли пользователей
type Role = 'admin' | 'portfolio_manager' | 'project_manager' | 'viewer';

// Интерфейс для управления доступом
interface AccessControl {
  userId: string;
  projectId: string;
  role: Role;
}

// Аудит лог
interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: Date;
  details: string;
}
```

## DTO для API

```typescript
// DTO для создания проекта
interface CreateProjectDTO {
  name: string;
  description: string;
  businessGoals: string[];
  ownerId: string;
  teamIds: string[];
  timeline: {
    start: Date;
    end: Date;
  };
  budget: number;
}

// DTO для обновления статуса проекта
interface UpdateProjectStatusDTO {
  projectId: string;
  status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  phase: 'planning' | 'development' | 'testing' | 'release';
}

// DTO для создания задачи
interface CreateTaskDTO {
  title: string;
  description?: string;
  assigneeId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  projectId: string;
  dependencyIds: string[];
}

// DTO для регистрации риска
interface CreateRiskDTO {
  description: string;
  probability: number;
  impact: number;
  mitigationPlan: string;
  ownerId: string;
  linkedTo: {
    type: 'project' | 'task';
    id: string;
  };
}