import Button from '@/components/ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">❓</span>
          <h3 className="text-xl font-bold text-gray-800">
            {title}
          </h3>
        </div>
        <div className="mb-4 text-gray-600 whitespace-pre-line">
          {message}
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            variant="danger"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}
