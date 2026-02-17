export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-mieno-gray py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">利用規約</h1>
          <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">Terms of Service</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8 text-gray-600 leading-relaxed font-sans">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">第1条（適用）</h2>
            <p>
              本規約は、株式会社三重野商会（以下、「当社」といいます。）が提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">第2条（利用登録）</h2>
            <p>
              登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
            <p>
              ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">第4条（禁止事項）</h2>
            <p>
              ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 pl-4">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
              <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">第5条（免責事項）</h2>
            <p>
              当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
            </p>
          </section>

          <div className="border-t border-gray-100 pt-8 mt-12 text-sm text-gray-400">
            <p>2024年1月1日 制定</p>
          </div>
        </div>
      </div>
    </div>
  );
}
