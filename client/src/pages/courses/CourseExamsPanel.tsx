import { useEffect, useState } from 'react';
import { Button, Typography, Empty, Spin } from 'antd';
import { listCourseExams, type CourseExamRow } from '../../services/exams.service';
import ExamTable from '../../components/exams/ExamTable';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

type Props = {
  courseId: string;
};

export default function CourseExamsPanel({ courseId }: Props) {
  const [rows, setRows] = useState<CourseExamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    listCourseExams(courseId)
      .then((data) => setRows(data))
      .finally(() => setLoading(false));
  }, [courseId]);

  const Header = (
    <div className="flex items-center justify-between mb-2">
      <Title level={4} style={{ margin: 0 }}>Exámenes de esta materia</Title>
      <Button type="primary" onClick={() => navigate(`/exams/create?courseId=${courseId}`)}>
        Crear examen
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div>
        {Header}
        <div style={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div>
        {Header}
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Empty description="Aún no hay exámenes para este curso">
            <Text style={{ fontSize: 14 }}>
              Los exámenes creados aparecerán aquí para su gestión.
            </Text>
          </Empty>
        </div>
      </div>
    );
  }

  const dataForExamTable = rows.map((r) => ({
    id: String(r.id),
    title: r.title,
    status: r.status === 'Publicado' ? 'published' : 'saved',
    visible: r.status === 'Publicado',
    createdAt: r.createdAt,
    publishedAt: r.status === 'Publicado' ? (r.updatedAt || r.createdAt) : undefined,
    questionsCount: (r as any)?.questionsCount ?? 0, 
  })) as any[];

  return (
    <div>
      {Header}
      <div id="tabla-examenes-curso">
        <ExamTable
          data={dataForExamTable}
          onEdit={() => navigate(`/exams/create?courseId=${courseId}`)}
        />
      </div>
    </div>
  );
}
