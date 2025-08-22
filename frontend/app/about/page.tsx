"use client";

import React from "react";

export default function About() {
  return (
    <main className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-100 rounded-full filter blur-xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full filter blur-xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-50 rounded-full filter blur-xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-xl">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 2l-4 20"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 2l4 20"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 2v20"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-black">
              Infra-DSC
            </h1>
            <div className="space-y-4 max-w-4xl mx-auto">
              <p className="text-2xl text-gray-800 font-semibold">
                目指そう。安全な道路をみんなへ。
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                私たちは安全な移動の実現をお手伝いします。
              </p>
            </div>
          </div>
        </div>

        {/* Background Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-12 justify-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-black">Background</h2>
            </div>

            <div className="relative">
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="group">
                    <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-black">
                          The Challenge
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed">
                          普段使っている道路がデコボコしていることが気になったことはありませんか？
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          日本ではこうしたインフラの老朽化が社会課題となっています。路面状態の把握は管理者による目視で行われることが多く，非効率的です。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-black">
                          Our Solution
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed">
                          私たちはインフラ点検のこのような課題を解決するために研究に取り組んでいます。
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          「郵便やごみ収集と連携した網羅的な路面データの収集」と「AIによる劣化の自動検出、定量的な評価」を目指します。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-black">
                          Impact
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        私たちのソリューションによってより先進的なインフラ維持管理プラットフォームを提供します。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Development History Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-12 justify-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-black">
                Development History
              </h2>
            </div>

            <div className="relative">
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-200">
                {/* Timeline */}
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-black"></div>

                  <div className="space-y-12">
                    {/* Phase 1 */}
                    <div className="relative flex items-start">
                      <div className="absolute left-6 w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
                      <div className="ml-20 group">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-center mb-4">
                            <span className="text-sm font-semibold text-white bg-black px-3 py-1 rounded-full mr-4">
                              Phase 1
                            </span>
                            <span className="text-gray-500">2024年 Q1-Q2</span>
                          </div>
                          <h3 className="text-xl font-bold text-black mb-3">
                            プロジェクト立ち上げ・基盤研究
                          </h3>
                          <ul className="text-gray-600 space-y-2">
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              インフラ点検の課題調査と要件定義
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              YOLO モデルの選定と基礎実験
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              データセット収集・整備開始
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="relative flex items-start">
                      <div className="absolute left-6 w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
                      <div className="ml-20 group">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-center mb-4">
                            <span className="text-sm font-semibold text-white bg-black px-3 py-1 rounded-full mr-4">
                              Phase 2
                            </span>
                            <span className="text-gray-500">2024年 Q3-Q4</span>
                          </div>
                          <h3 className="text-xl font-bold text-black mb-3">
                            AI モデル開発・訓練
                          </h3>
                          <ul className="text-gray-600 space-y-2">
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              クラック検出用YOLOモデルの訓練
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              セグメンテーションモデルの実装
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              モデル最適化とパフォーマンス改善
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="relative flex items-start">
                      <div className="absolute left-6 w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
                      <div className="ml-20 group">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-center mb-4">
                            <span className="text-sm font-semibold text-white bg-black px-3 py-1 rounded-full mr-4">
                              Phase 3
                            </span>
                            <span className="text-gray-500">2025年 Q1-Q2</span>
                          </div>
                          <h3 className="text-xl font-bold text-black mb-3">
                            プラットフォーム開発
                          </h3>
                          <ul className="text-gray-600 space-y-2">
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              Django REST Framework によるバックエンド構築
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              Next.js フロントエンド開発
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              リアルタイム解析機能の実装
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Phase 4 - Current */}
                    <div className="relative flex items-start">
                      <div className="absolute left-6 w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
                      <div className="ml-20 group">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-center mb-4">
                            <span className="text-sm font-semibold text-white bg-black px-3 py-1 rounded-full mr-4">
                              Phase 4
                            </span>
                            <span className="text-gray-500">
                              2025年 Q3 - 現在
                            </span>
                            <span className="text-xs text-white bg-gray-600 px-2 py-1 rounded-full ml-2">
                              進行中
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-black mb-3">
                            統合・テスト・改善
                          </h3>
                          <ul className="text-gray-600 space-y-2">
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              システム統合とエンドツーエンドテスト
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              ユーザーインターフェース改善
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                              パフォーマンス最適化とスケーラビリティ向上
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-16">
          <div className="max-w-7xl mx-auto relative">
            <div className="relative bg-black rounded-3xl p-12 shadow-xl border border-gray-200">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                安全な道路を一緒に作ろう！
              </h3>
              <p className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed max-w-2xl mx-auto">
                AI駆動の損傷検出の力を体験し、インフラ管理を次のレベルに引き上げましょう。
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/"
                  className="group inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  Try Now
                </a>
                <a
                  href="/contact"
                  className="group inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  );
}
