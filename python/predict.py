import json
import os
import sys
import hashlib


def mock_predict(video_path: str) -> dict:
    file_size = os.path.getsize(video_path)
    basename = os.path.basename(video_path)

    seed_material = f"{basename}|{file_size}".encode("utf-8")
    digest = hashlib.sha256(seed_material).hexdigest()

    val = int(digest[:8], 16)
    prediction = "real" if (val % 2 == 0) else "fake"

    # Confidence in [0.50, 0.99]
    confidence = 0.50 + ((val % 4900) / 10000.0)
    confidence = round(confidence, 4)

    return {
        "prediction": prediction,
        "confidence": confidence,
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing video_path argument"}))
        sys.exit(1)

    video_path = sys.argv[1]
    if not os.path.exists(video_path):
        print(json.dumps({"error": "Video path does not exist"}))
        sys.exit(1)

    result = mock_predict(video_path)
    # Print pure JSON to stdout.
    print(json.dumps(result))


if __name__ == "__main__":
    main()

