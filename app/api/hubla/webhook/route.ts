import { NextRequest, NextResponse } from 'next/server';
import { addAuthorizedUser } from '@/lib/auth/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📦 Webhook Hubla recebido:', body);

    // Verifica se é uma compra aprovada
    // A Hubla envia diferentes eventos, precisamos validar
    const evento = body.event || body.type;

    // Adapte de acordo com a estrutura do webhook da Hubla
    // Normalmente: 'purchase.approved', 'purchase.completed', etc.
    const eventosValidos = ['purchase.approved', 'order.approved', 'sale.approved', 'APPROVED'];

    if (!eventosValidos.includes(evento)) {
      return NextResponse.json(
        { message: 'Evento ignorado', evento },
        { status: 200 }
      );
    }

    // Extrai email do comprador
    // A estrutura pode variar, adapte conforme necessário:
    const email =
      body.customer?.email ||
      body.buyer?.email ||
      body.email ||
      body.data?.customer?.email;

    if (!email) {
      console.error('❌ Email não encontrado no webhook:', body);
      return NextResponse.json(
        { error: 'Email não encontrado no webhook' },
        { status: 400 }
      );
    }

    // Adiciona usuário autorizado e gera código
    const user = addAuthorizedUser(email, {
      hublaEvent: evento,
      purchaseData: body,
      receivedAt: new Date().toISOString(),
    });

    console.log('✅ Usuário autorizado:', user.email, '| Código:', user.codigo);

    // TODO: Enviar email com o código de acesso
    // Você pode integrar com SendGrid, Resend, ou outro serviço aqui
    // await sendAccessCodeEmail(user.email, user.codigo);

    return NextResponse.json({
      success: true,
      message: 'Usuário autorizado com sucesso',
      email: user.email,
      // Não retorne o código na resposta por segurança
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

// Permite GET para testar se a rota está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Webhook Hubla - Use POST para enviar dados',
    status: 'ok',
  });
}
