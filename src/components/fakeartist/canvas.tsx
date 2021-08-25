import React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { SketchPicker } from 'react-color';
import { KonvaEventObject } from 'konva/lib/Node';
import styles from '../../styles/components/fakeartist/canvas.module.scss';

const Canvas = (): JSX.Element => {
    const [tool, setTool] = React.useState('pen');
    const [size, setSize] = React.useState(5);
    const [color, setColor] = React.useState('#000000');
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const stageRef = React.useRef();

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([
            ...lines,
            {
                tool,
                points: [pos.x, pos.y],
                color,
                size,
            },
        ]);
    };

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    return (
        <div className={styles.canvas}>
            <div>
                <select
                    value={tool}
                    onChange={(e) => {
                        setTool(e.target.value);
                    }}
                >
                    <option value="pen">ペン</option>
                    <option value="eraser">消しゴム</option>
                </select>
                <select
                    value={size}
                    onChange={(e) => {
                        setSize(Number(e.target.value));
                    }}
                >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
            <div className={styles.stage}>
                <div>
                    <Stage
                        width={300}
                        height={300}
                        onMouseDown={handleMouseDown}
                        onMousemove={handleMouseMove}
                        onMouseup={handleMouseUp}
                        style={{
                            border: 'solid',
                            marginTop: '10px',
                        }}
                        ref={stageRef}
                    >
                        <Layer>
                            {lines.map((line, i) => (
                                <Line
                                    key={i}
                                    points={line.points}
                                    stroke={line.color}
                                    strokeWidth={line.size}
                                    tension={0.5}
                                    lineCap="round"
                                    globalCompositeOperation={
                                        line.tool === 'eraser'
                                            ? 'destination-out'
                                            : 'source-over'
                                    }
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
                <SketchPicker
                    color={color}
                    onChangeComplete={handleChangeComplete}
                />
            </div>
        </div>
    );
};
export default Canvas;
