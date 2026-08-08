include Makefile

.PHONY: dev-down down

dev-down:
	@pattern='$(abspath .)/(back|front)/[n]ode_modules/'; \
	if pgrep -f "$$pattern" >/dev/null; then \
		echo "Stopping Finapp backend and frontend..."; \
		pkill -TERM -f "$$pattern"; \
		attempts=0; \
		while pgrep -f "$$pattern" >/dev/null && [ "$$attempts" -lt 50 ]; do \
			sleep 0.1; \
			attempts=$$((attempts + 1)); \
		done; \
		if pgrep -f "$$pattern" >/dev/null; then \
			echo "Forcing remaining Finapp development processes to stop..."; \
			pkill -KILL -f "$$pattern"; \
		fi; \
	else \
		echo "Finapp backend and frontend are not running."; \
	fi

down: dev-down db-down
