import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { ExcelImportResult } from '@/lib/backup';
import PageLayout from '@/components/layout/PageLayout';
import FormLayout from '@/components/layout/FormLayout';
import ImportExcelModal from '@/components/business/ImportExcelModal';
import ContinueSession from '@/components/business/Home/ContinueSession';
import EmptyState from '@/components/business/Home/EmptyState';
import EventSelection from '@/components/business/Home/EventSelection';

export default function Home() {
  const navigate = useNavigate();
  const { state, actions } = useAppStore();
  const [showSessionChoice, setShowSessionChoice] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentSessionEvent, setCurrentSessionEvent] = useState<any>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // 初始化时检查会话状态
  useEffect(() => {
    if (state.loading.events) {
      return;
    }

    const session = sessionStorage.getItem('currentEvent');
    if (session) {
      try {
        const { event: currentEvent } = JSON.parse(session);
        setShowSessionChoice(true);
        setCurrentSessionEvent(currentEvent);
        return;
      } catch (e) {
        console.error('Failed to parse session:', e);
      }
    }

    if (state.events.length > 0) {
      setSelectedEvent(state.events[0]);
    }
  }, [state.events, state.loading.events, navigate]);

  // 处理选择事件并进入
  const handleSelectEvent = (event: any) => {
    actions.saveSession(event);
    navigate('/main', { replace: true });
  };

  // 处理继续使用当前会话
  const handleContinueSession = () => {
    navigate('/main');
  };

  // 处理切换到其他事件
  const handleSwitchFromSession = () => {
    actions.clearSession();
    setShowSessionChoice(false);
  };

  // 处理切换到特定事件
  const handleSwitchToSpecificEvent = (targetEvent: any) => {
    actions.saveSession(targetEvent);
    navigate('/main', { replace: true });
  };

  // 处理创建新事件
  const handleCreateNewEvent = () => {
    navigate('/setup');
  };

  // 处理导入Excel成功
  const handleImportSuccess = (result: ExcelImportResult) => {
    let msg = `成功导入 ${result.gifts} 条礼金记录`;
    if (result.events > 0) {
      msg += `、${result.events} 个事件`;
    }
    if (result.conflicts > 0) {
      msg += `，跳过 ${result.skipped} 条重复`;
    }
    setImportSuccessMsg(result.message || msg);
    setShowImportModal(false);
    actions.loadEvents();

    if (result.events > 0) {
      setTimeout(() => {
        actions.loadEvents().then(() => {
          if (state.events.length > 0) {
            handleSelectEvent(state.events[0]);
          }
        });
      }, 3000);
    }
  };

  // 监听事件列表变化，自动清除提示
  useEffect(() => {
    if (importSuccessMsg && state.events.length > 0) {
      setTimeout(() => {
        setImportSuccessMsg(null);
      }, 1000);
    }
  }, [state.events, importSuccessMsg]);

  // 会话选择界面
  if (showSessionChoice && currentSessionEvent) {
    const otherEvents = state.events.filter(ev => ev.id !== currentSessionEvent.id);

    return (
      <>
        <PageLayout title="电子礼簿系统" subtitle="检测到当前会话">
          <FormLayout>
            <ContinueSession
              currentSessionEvent={currentSessionEvent}
              onContinue={handleContinueSession}
              onSwitch={handleSwitchFromSession}
              onSwitchToEvent={handleSwitchToSpecificEvent}
              onCreateNew={handleCreateNewEvent}
              onImport={() => setShowImportModal(true)}
              otherEvents={otherEvents}
            />
          </FormLayout>
        </PageLayout>

        <ImportExcelModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
          currentEvent={selectedEvent}
          allEvents={state.events}
        />
      </>
    );
  }

  // 空状态界面
  if (state.events.length === 0) {
    return (
      <>
        <PageLayout title="电子礼簿系统" subtitle="还没有事件，请选择操作">
          <FormLayout>
            <EmptyState
              onCreateNew={handleCreateNewEvent}
              onImport={() => setShowImportModal(true)}
              importSuccessMsg={importSuccessMsg}
              onClearImportMsg={() => setImportSuccessMsg(null)}
            />
          </FormLayout>
        </PageLayout>

        <ImportExcelModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
          currentEvent={selectedEvent}
          allEvents={state.events}
        />
      </>
    );
  }

  // 事件选择界面
  return (
    <>
      <PageLayout title="电子礼簿系统" subtitle="请选择事件">
        <FormLayout>
          <EventSelection
            events={state.events}
            onSelectEvent={handleSelectEvent}
            onCreateNew={handleCreateNewEvent}
            onImport={() => setShowImportModal(true)}
          />
        </FormLayout>
      </PageLayout>

      <ImportExcelModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={handleImportSuccess}
        currentEvent={selectedEvent}
        allEvents={state.events}
      />
    </>
  );
}
