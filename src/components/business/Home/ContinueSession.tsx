import { Event } from '@/types';
import { formatDateTime } from '@/utils/format';
import Button from '@/components/ui/Button';

interface ContinueSessionProps {
  currentSessionEvent: Event;
  onContinue: () => void;
  onSwitch: () => void;
  onSwitchToEvent: (event: Event) => void;
  onCreateNew: () => void;
  onImport: () => void;
  otherEvents: Event[];
}

export default function ContinueSession({
  currentSessionEvent,
  onContinue,
  onSwitch,
  onSwitchToEvent,
  onCreateNew,
  onImport,
  otherEvents,
}: ContinueSessionProps) {
  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
      <div className="font-bold text-blue-900 mb-1 text-sm">
        当前事件：
      </div>
      <div className="text-sm text-blue-800 font-semibold">
        {currentSessionEvent.name}
      </div>
      <div className="text-xs text-blue-600 mt-1">
        {formatDateTime(currentSessionEvent.startDateTime)} ~ {formatDateTime(currentSessionEvent.endDateTime)}
      </div>

      <div className="space-y-3 mt-3">
        <Button
          variant="primary"
          className="w-full p-3 rounded-lg font-bold"
          onClick={onContinue}
        >
          继续使用当前事件
        </Button>

        <Button
          variant="secondary"
          className="w-full p-3 rounded-lg font-bold"
          onClick={onSwitch}
        >
          切换到其他事件
        </Button>

        {otherEvents.length > 0 && (
          <div className="pt-3 border-t themed-border">
            <p className="text-sm text-gray-600 mb-2">快速切换：</p>
            <div className="space-y-2">
              {otherEvents.map((ev) => (
                <Button
                  key={ev.id}
                  variant="secondary"
                  className="w-full text-left px-3 py-2 text-sm !bg-gray-100 !text-gray-800 !border-transparent hover:!bg-gray-200"
                  onClick={() => onSwitchToEvent(ev)}
                >
                  {ev.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t themed-border space-y-2">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 text-sm p-2 rounded"
              onClick={onCreateNew}
            >
              ✨ 创建新事件
            </Button>
            <Button
              variant="secondary"
              className="flex-1 text-sm p-2 rounded"
              onClick={onImport}
            >
              📥 导入数据
            </Button>
          </div>
          <Button
            variant="danger"
            className="w-full p-2 rounded text-sm"
            onClick={() => {
              if (confirm("确定要删除所有事件吗？礼金记录会保留但无法访问。")) {
                localStorage.removeItem('giftlist_events');
                window.location.reload();
              }
            }}
          >
            🗑️ 清除事件
          </Button>
        </div>
      </div>
    </div>
  );
}
