import { useEffect, useState, useRef } from "react";
import { Utils } from "@/lib/utils";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevGiftCountRef = useRef(0);
  const lastNewDataTimeRef = useRef(0); // 记录最新数据时间
  const autoScrollIntervalRef = useRef<number | null>(null); // 自动轮播定时器
  const isAutoScrollingRef = useRef(false); // 是否正在自动轮播

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

  // 数据更新处理 + 自动轮播逻辑
  useEffect(() => {
    if (!data || !scrollRef.current) return;

    const hasNewData = data.gifts.length > prevGiftCountRef.current;
    const currentTime = Date.now();

    // 清除之前的轮播定时器
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    if (hasNewData) {
      // ✅ 有新数据：滚动到最新记录
      lastNewDataTimeRef.current = currentTime;
      isAutoScrollingRef.current = false;

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 100);

      // 启动10秒后的轮播检查
      autoScrollIntervalRef.current = setInterval(() => {
        checkAndStartAutoScroll();
      }, 1000); // 每秒检查一次

    } else if (data.gifts.length > 0) {
      // ✅ 无新数据但有数据：检查是否需要开始轮播
      checkAndStartAutoScroll();
    }

    prevGiftCountRef.current = data.gifts.length;

    // 清理函数
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [data]);

  // 检查并开始自动轮播
  const checkAndStartAutoScroll = () => {
    if (!scrollRef.current || !data || data.gifts.length === 0) return;

    const timeSinceLastNewData = Date.now() - lastNewDataTimeRef.current;
    const scrollWidth = scrollRef.current.scrollWidth;
    const clientWidth = scrollRef.current.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;

    // 超过10秒无新数据，且数据足够滚动
    if (timeSinceLastNewData > 10000 && maxScrollLeft > 0 && !isAutoScrollingRef.current) {
      startAutoScroll();
    }
  };

  // 开始自动轮播（单向无限滚动）
  const startAutoScroll = () => {
    if (!scrollRef.current || isAutoScrollingRef.current) return;

    isAutoScrollingRef.current = true;
    const scrollElement = scrollRef.current;
    const scrollWidth = scrollElement.scrollWidth;
    const clientWidth = scrollElement.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;

    // 如果数据不够滚动，直接返回
    if (maxScrollLeft <= 0) {
      isAutoScrollingRef.current = false;
      return;
    }

    // 从最右侧开始
    scrollElement.scrollLeft = maxScrollLeft;

    const scrollStep = () => {
      if (!isAutoScrollingRef.current || !scrollElement) return;

      // 单向向左滚动（从右到左）
      scrollElement.scrollLeft -= 1;

      // 到达左边界，重置到最右侧继续滚动
      if (scrollElement.scrollLeft <= 0) {
        scrollElement.scrollLeft = maxScrollLeft;
      }

      // 继续下一次滚动
      if (isAutoScrollingRef.current) {
        requestAnimationFrame(scrollStep);
      }
    };

    // 启动轮播
    requestAnimationFrame(scrollStep);
  };

  if (!data) {
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

  const themeClass = data.theme === "theme-festive" ? "theme-festive" : "theme-solemn";

  return (
    <div className={`guest-screen-wrapper ${themeClass}`}>
      {/* 标题和统计 */}
      <div className="guest-screen-header">
        <h1 className="guest-screen-title">{data.eventName}</h1>
        <div className="guest-screen-info">
          <span>总数: {data.gifts.length}人</span>
          <span>总金额: ¥{data.gifts.reduce((sum, g) => sum + g.amount, 0).toFixed(0)}</span>
        </div>
      </div>

      {/* 礼金列表 - 横向滚动 */}
      <div className="guest-screen-list" ref={scrollRef}>
        {data.gifts.map((gift, idx) => {
          const isLatest = idx === data.gifts.length - 1;
          return (
            <div
              key={idx}
              className={`guest-screen-column ${isLatest ? 'latest' : ''}`}
              data-index={idx}>
              <div className="guest-screen-name">
                {formatName(gift.name)}
              </div>
              <div className="guest-screen-amount">
                {Utils.amountToChinese(gift.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
