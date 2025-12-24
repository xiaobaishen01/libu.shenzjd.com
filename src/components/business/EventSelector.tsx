import React from 'react';
import { Event } from '@/types';
import { formatDateTime } from '@/utils/format';
import Button from '@/components/ui/Button';

interface EventSelectorProps {
  events: Event[];
  onSelect: (event: Event) => void;
  onCreateNew: () => void;
  title?: string;
  subtitle?: string;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  events,
  onSelect,
  onCreateNew,
  title = '选择活动',
  subtitle = '请选择要管理的活动',
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold themed-header mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="p-4 themed-ring rounded-xl border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelect(event)}
          >
            <div className="font-semibold text-gray-800">{event.name}</div>
            <div className="text-sm text-gray-600 mt-1">
              {formatDateTime(event.startDateTime)} ~ {formatDateTime(event.endDateTime)}
            </div>
            {event.recorder && (
              <div className="text-xs text-gray-500 mt-1">记账人: {event.recorder}</div>
            )}
            <div className="text-xs mt-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                event.theme === 'festive' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {event.theme === 'festive' ? '🎉 喜事' : '🕯️ 丧事'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t themed-border">
        <Button 
          variant="primary" 
          className="w-full" 
          onClick={onCreateNew}
        >
          ✨ 创建新活动
        </Button>
      </div>
    </div>
  );
};

export default EventSelector;