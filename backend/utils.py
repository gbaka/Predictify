import os
import errno

class SimpleFileLock:
    def __init__(self, lock_file_path: str):
        self.lock_file_path = lock_file_path
        self._fd = None

    def acquire(self) -> bool:
        try:
            # Открываем файл для записи, O_CREAT | O_EXCL гарантирует атомарность
            self._fd = os.open(self.lock_file_path, os.O_CREAT | os.O_EXCL | os.O_RDWR)
            os.write(self._fd, str(os.getpid()).encode())  # Записываем PID
            return True
        except OSError as e:
            if e.errno == errno.EEXIST:
                return False  # Lock-файл уже существует
            raise

    def release(self):
        if self._fd is not None:
            os.close(self._fd)
            os.unlink(self.lock_file_path)
            self._fd = None

    def is_locked(self) -> bool:
        return os.path.exists(self.lock_file_path)
