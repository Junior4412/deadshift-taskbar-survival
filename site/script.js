const champions={
 maya:{role:'BATEDORA · DPS',copy:'Especialista em dano rápido. Sua alta velocidade de ataque, rajadas e marcação de alvos fazem dela a melhor escolha para eliminar inimigos prioritários.',stats:[92,42,28,96],abilities:[['RAJADA','Seis disparos contra o alvo.'],['PASSO FANTASMA','Aumenta a velocidade temporariamente.'],['MARCA DO CAÇADOR','Amplifica o dano recebido pela horda.']],gear:['ATQ','VEL','CRÍTICO']},
 bruno:{role:'BRUTAMONTES · TANK',copy:'A linha de frente do esquadrão. Bruno absorve impacto, provoca inimigos e controla grupos com atordoamentos enquanto protege a base.',stats:[68,98,46,32],abilities:[['PROVOCAÇÃO','Atrai a pressão e reduz dano aliado.'],['IMPACTO SÍSMICO','Atordoa inimigos próximos.'],['FORTIFICAÇÃO','Reforça a defesa e recupera a base.']],gear:['VIDA','DEFESA','BLOQUEIO']},
 yuri:{role:'MÉDICO · SUPORTE',copy:'Mantém o grupo vivo nas operações longas. Yuri cura o aliado mais ferido, acelera ataques e consegue reanimar a formação.',stats:[34,55,100,70],abilities:[['PRIMEIROS SOCORROS','Cura o aliado com menos vida.'],['ESTIMULANTE','Aumenta a velocidade da equipe.'],['REANIMAÇÃO','Levanta sobreviventes incapacitados.']],gear:['CURA','VIDA','VEL']},
 iris:{role:'INCENDIÁRIA · DPS EM ÁREA',copy:'Especialista contra hordas densas. Iris espalha fogo, minas e controle de terreno para atingir vários infectados ao mesmo tempo.',stats:[96,48,38,62],abilities:[['COQUETEL MOLOTOV','Incendeia uma área por vários segundos.'],['MINA TÉRMICA','Atordoa, desacelera e causa dano.'],['INFERNO','Queima todos os inimigos em campo.']],gear:['ATQ','ÁREA','FOGO']}
};
document.querySelectorAll('[data-champion]').forEach(button=>button.addEventListener('click',()=>{
 const id=button.dataset.champion,data=champions[id];document.querySelectorAll('[data-champion]').forEach(b=>b.classList.toggle('active',b===button));
 const art=document.querySelector('#champion-art');art.className='champion-art '+id;document.querySelector('#champion-role').textContent=data.role;document.querySelector('#champion-name').textContent=id.toUpperCase();document.querySelector('#champion-copy').textContent=data.copy;
 document.querySelector('#champion-stats').innerHTML=['DANO','DEFESA','SUPORTE','VELOCIDADE'].map((name,i)=>`<label>${name}<i style="--value:${data.stats[i]}%"></i></label>`).join('');
 document.querySelector('#champion-abilities').innerHTML=data.abilities.map(a=>`<span><b>${a[0]}</b><small>${a[1]}</small></span>`).join('');
 document.querySelector('.best-gear').innerHTML='<b>PRIORIZE</b>'+data.gear.map(g=>`<span>${g}</span>`).join('');
}));
