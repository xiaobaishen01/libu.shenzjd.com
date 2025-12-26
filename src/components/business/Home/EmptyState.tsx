import Button from '@/components/ui/Button';

interface EmptyStateProps {
  onCreateNew: () => void;
  onImport: () => void;
  importSuccessMsg?: string | null;
  onClearImportMsg?: () => void;
}

export default function EmptyState({
  onCreateNew,
  onImport,
  importSuccessMsg,
  onClearImportMsg,
}: EmptyStateProps) {
  return (
    <div className="space-y-3">
      {/* 导入成功提示 */}
      {importSuccessMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-green-800 text-sm">
            <span>✅</span>
            <span>{importSuccessMsg}</span>
          </div>
          <button
            onClick={onClearImportMsg}
            className="text-green-600 hover:text-green-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="text-center text-gray-600 mb-4">
        <p className="text-sm">欢迎使用电子礼簿系统</p>
        <p className="text-xs mt-1">您可以创建新事件或导入Excel数据</p>
      </div>

      <Button
        variant="primary"
        className="w-full p-3 rounded-lg font-bold"
        onClick={onCreateNew}
      >
        ✨ 创建新事件
      </Button>

      <Button
        variant="secondary"
        className="w-full p-3 rounded-lg font-bold"
        onClick={onImport}
      >
        📥 导入数据
      </Button>

      <div className="pt-4 border-t themed-border">
        <p className="text-xs text-gray-500 text-center">
          💡 提示：支持导入Excel文件创建新事件或合并数据
        </p>
      </div>
    </div>
  );
}
