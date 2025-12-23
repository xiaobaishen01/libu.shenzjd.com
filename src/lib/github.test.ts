import { GitHubService } from './github';

// Mock fetch globally
global.fetch = jest.fn();

describe('GitHubService', () => {
  let service: GitHubService;
  const mockConfig = {
    owner: 'testuser',
    repo: 'test-repo',
    token: 'ghp_testtoken123'
  };

  beforeEach(() => {
    service = new GitHubService(mockConfig);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with config', () => {
      expect(service).toBeInstanceOf(GitHubService);
    });
  });

  describe('testConnection', () => {
    it('should return true when connection succeeds', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      const result = await service.testConnection();
      expect(result).toBe(true);
    });

    it('should return false when connection fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await service.testConnection();
      expect(result).toBe(false);
    });

    it('should return false on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.testConnection();
      expect(result).toBe(false);
    });

    it('should call correct GitHub API endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      await service.testConnection();

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.github.com/repos/${mockConfig.owner}/${mockConfig.repo}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `token ${mockConfig.token}`
          })
        })
      );
    });
  });

  describe('readFile', () => {
    it('should read file successfully', async () => {
      const mockContent = 'test content';
      const encodedContent = btoa(unescape(encodeURIComponent(mockContent)));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ content: encodedContent })
      });

      const result = await service.readFile('data/events.json');
      expect(result).toBe(mockContent);
    });

    it('should return null when file not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await service.readFile('data/events.json');
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.readFile('data/events.json');
      expect(result).toBeNull();
    });
  });

  describe('writeFile', () => {
    it('should write new file successfully', async () => {
      // First call: readFile returns null (file doesn't exist)
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({})
        });

      await service.writeFile('data/events.json', 'test content', 'Create file');

      // Verify PUT request was made
      const putCall = (global.fetch as jest.Mock).mock.calls.find(
        call => call[1]?.method === 'PUT'
      );
      expect(putCall).toBeDefined();
      expect(putCall[0]).toContain('data/events.json');
    });

    it('should update existing file with sha', async () => {
      const existingSha = 'abc123';

      // First call: readFile calls request which returns existing file
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ content: 'dGVzdA==', sha: existingSha })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ sha: existingSha })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({})
        });

      await service.writeFile('data/events.json', 'new content', 'Update file');

      // Verify PUT request includes sha
      const putCall = (global.fetch as jest.Mock).mock.calls.find(
        call => call[1]?.method === 'PUT'
      );
      const body = JSON.parse(putCall[1].body);
      expect(body.sha).toBe(existingSha);
      expect(body.message).toBe('Update file');
    });

    it('should handle write errors', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })
        .mockRejectedValueOnce(new Error('Write failed'));

      await expect(
        service.writeFile('data/events.json', 'content', 'message')
      ).rejects.toThrow('Write failed');
    });
  });

  describe('syncEvents', () => {
    it('should sync events successfully', async () => {
      const mockEvents = [
        { id: 'evt_1', name: 'Event 1', guests: [] }
      ];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({})
        });

      await service.syncEvents(mockEvents);

      const putCall = (global.fetch as jest.Mock).mock.calls.find(
        call => call[1]?.method === 'PUT'
      );
      const body = JSON.parse(putCall[1].body);
      const decodedContent = decodeURIComponent(escape(atob(body.content)));
      const events = JSON.parse(decodedContent);

      expect(events).toEqual(mockEvents);
      expect(body.message).toBe('Update events');
    });

    it('should handle complex event data', async () => {
      const complexEvents = [
        {
          id: 'evt_1',
          name: '张三李四新婚之喜',
          guests: [
            { id: 'g1', name: 'Alice', amount: 888, note: '🎉' }
          ]
        }
      ];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({})
        });

      await service.syncEvents(complexEvents);

      const putCall = (global.fetch as jest.Mock).mock.calls.find(
        call => call[1]?.method === 'PUT'
      );
      const body = JSON.parse(putCall[1].body);
      const decodedContent = decodeURIComponent(escape(atob(body.content)));
      const events = JSON.parse(decodedContent);

      expect(events).toEqual(complexEvents);
    });
  });

  describe('syncGifts', () => {
    it('should sync gifts successfully', async () => {
      const eventId = 'evt_123';
      const gifts = [
        { id: 'g1', name: 'Alice', amount: 100 }
      ];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({})
        });

      await service.syncGifts(eventId, gifts);

      const putCall = (global.fetch as jest.Mock).mock.calls.find(
        call => call[1]?.method === 'PUT'
      );
      expect(putCall[0]).toContain(`data/gifts/${eventId}.json`);

      const body = JSON.parse(putCall[1].body);
      const decodedContent = decodeURIComponent(escape(atob(body.content)));
      const decodedGifts = JSON.parse(decodedContent);

      expect(decodedGifts).toEqual(gifts);
      expect(body.message).toBe(`Update gifts for ${eventId}`);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow', async () => {
      // Test Connection
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      const canConnect = await service.testConnection();
      expect(canConnect).toBe(true);

      // Read Events (not found)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const events = await service.readFile('data/events.json');
      expect(events).toBeNull();

      // Write Events
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({})
        });

      await service.syncEvents([{ id: 'evt_1', name: 'New Event', guests: [] }]);

      // Verify the write was successful
      const writeCall = (global.fetch as jest.Mock).mock.calls.find(
        call => call[1]?.method === 'PUT'
      );
      expect(writeCall).toBeDefined();
    });

    it('should handle rate limiting response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Map([['retry-after', '60']])
      });

      const result = await service.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON in response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        }
      });

      const result = await service.readFile('data/events.json');
      expect(result).toBeNull();
    });

    it('should handle network timeouts', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('timeout of 5000ms exceeded')
      );

      const result = await service.testConnection();
      expect(result).toBe(false);
    });
  });
});
