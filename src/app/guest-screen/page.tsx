import { useEffect, useState } from "react";
import { amountToChinese } from "@/utils/format";

declare global {
  interface Window {
    // Add global window properties if needed
  }
}

interface GiftData {
  name: string;
  amount: number;
  type: "现金" | "微信" | "支付宝" | "其他";
  remark?: string;
  timestamp: string;
  abolished?: boolean;
}

interface SyncData {
  eventName: string;
  theme: string;
  gifts: GiftData[];
}

export default function GuestScreen() {
  const [data, setData] = useState<SyncData | null>(null);

  // 监听数据同步
  useEffect(() => {
    const handleStorageChange = () => {
      const syncData = localStorage.getItem("guest_screen_data");
      if (syncData) {
        try {
          const parsed = JSON.parse(syncData) as SyncData;
          setData(parsed);
        } catch (e) {
          console.error("解析同步数据失败:", e);
        }
      }
    };

    handleStorageChange();
    const interval = setInterval(handleStorageChange, 2000);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!data || data.gifts.length === 0) {
    return (
      <div className="guest-screen-empty">
        <h1>副屏展示</h1>
        <p>等待主屏数据同步...</p>
      </div>
    );
  }

  // 格式化姓名（两个字中间加空格）
  const formatName = (name: string) => {
    return name.length === 2 ? `${name[0]}　${name[1]}` : name;
  };

  const themeClass =
    data.theme === "theme-festive" ? "theme-festive" : "theme-solemn";

  // 只显示最新的12条数据（单行展示）
  const MAX_DISPLAY = 12;
  const allGifts = data.gifts.slice(-MAX_DISPLAY);

  return (
    <div className={`guest-screen-wrapper ${themeClass}`}>
      {/* 顶部标题 - 固定在上方 */}
      <div className="guest-screen-header">
        <h1 className="guest-screen-title">{data.eventName}</h1>
      </div>

      {/* 礼簿内容 - 显示最新数据 */}
      <div className="gift-book-columns">
        {allGifts.map((gift, idx) => {
          const isLatest = idx === allGifts.length - 1;
          return (
            <div
              key={idx}
              className={`gift-book-column ${isLatest ? "latest" : ""}`}
              data-index={idx}>
              <div className="book-cell name-cell column-top">
                <div className="name">{formatName(gift.name)}</div>
              </div>
              <div className="book-cell amount-cell column-bottom">
                <div className="amount-chinese">
                  {amountToChinese(gift.amount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
