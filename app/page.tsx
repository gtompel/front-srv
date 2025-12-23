import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Административный сервис учёта проектов и технологий
        </h1>
        <p className="text-lg text-slate-700 mb-6">
          Единый источник истины для руководства и команд: управление портфелем
          проектов, каталог технологий, планирование и отчётность.
        </p>

        <div className="flex gap-3 justify-center mb-10">
          <Link
            href="/auth/login"
            className="inline-block bg-sky-600 text-white px-5 py-2 rounded-md"
          >
            Войти
          </Link>
          <Link
            href="/auth/login"
            className="inline-block border border-slate-300 px-5 py-2 rounded-md"
          >
            Демо
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Ключевые возможности
        </h2>
        <ul className="grid sm:grid-cols-2 gap-4 text-left list-disc pl-6 text-slate-700">
          <li>Управление портфелем проектов: CRUD, фазы, статусы</li>
          <li>Каталог технологий и жизненный цикл</li>
          <li>Планирование задач, зависимости и диаграмма Ганта</li>
          <li>Управление ресурсами и загрузкой сотрудников</li>
          <li>Контроль бюджета и оповещения о превышении</li>
          <li>Риски, ответственность и оперативные дайджесты</li>
        </ul>
      </div>
    </section>
  );
}
