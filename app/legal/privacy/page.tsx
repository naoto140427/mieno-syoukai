export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-mieno-gray py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">プライバシーポリシー</h1>
          <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">Privacy Policy</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8 text-gray-600 leading-relaxed font-sans">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">1. 個人情報の収集について</h2>
            <p>
              当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">2. 個人情報の利用目的</h2>
            <p>
              当社が個人情報を収集・利用する目的は、以下のとおりです。
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 pl-4">
              <li>当社サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
              <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため</li>
              <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">3. 個人情報の第三者提供</h2>
            <p>
              当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">4. 個人情報の開示</h2>
            <p>
              当社は、本人から個人情報の開示を求められたときは、本人に対しこれを開示します。ただし、開示することにより本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合、当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合、その他法令に違反することとなる場合には、その全部または一部を開示しないこともあります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">5. お問い合わせ窓口</h2>
            <p>
              本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
              <p>株式会社三重野商会 個人情報取扱担当</p>
              <p>Eメールアドレス：privacy@mieno-corp.com</p>
            </div>
          </section>

          <div className="border-t border-gray-100 pt-8 mt-12 text-sm text-gray-400">
            <p>2024年1月1日 制定</p>
          </div>
        </div>
      </div>
    </div>
  );
}
